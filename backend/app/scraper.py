import requests
from bs4 import BeautifulSoup
import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from .chatbot import initialize_chatbot, get_chatbot_response
import ast  # To safely convert string to list
from playwright.sync_api import sync_playwright

class JobScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # Initialize chatbot once
        self.chatbot = initialize_chatbot()

    def extract_salary(self, text):
        """Extract salary range from text using regex"""
        if not text:
            return ''
        # Match Indian currency format and ranges
        pattern = r'(?:₹|Rs|INR)\s*[\d,]+(?:\s*-\s*(?:₹|Rs|INR)\s*[\d,]+)?(?:\s*(?:LPA|PA|per annum|annually))?'
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(0) if match else ''

    def extract_experience(self, text):
        """Extract experience requirements from text"""
        if not text:
            return ''
        # Match experience patterns like "2-3 years", "2+ years", "fresher"
        pattern = r'\d+(?:\s*-\s*\d+|\s*\+)?\s*(?:years?|yrs?)|fresher'
        match = re.search(pattern, text, re.IGNORECASE)
        return match.group(0) if match else ''

    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ''
        return ' '.join(text.split())

    def scrape_job(self, url=None, post_text=None):
        try:
            # Initialize job data with default values
            job_data = {
                'job_title': '',
                'job_location': '',
                'department': '',
                'range_of_salary': '',
                'profile': '',
                'job_description': '',
                'requirements': '',
                'job_benefits': '',
                'telecommunication': 0,
                'company_logo': 0,
                'type_of_employment': '',
                'experience': '',
                'qualification': '',
                'type_of_industry': '',
                'operations': '',
                'fraudulent': 'No'
            }

            if url:
                response = requests.get(url, headers=self.headers)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                if 'linkedin.com' in url:
                    job_data.update(self._scrape_linkedin(soup))
                elif 'internshala.com' in url:
                    job_data.update(self._scrape_internshala(soup))
                elif 'naukri.com' in url:
                    job_data.update(self._scrape_naukri(url))
                elif 'unstop.com' in url:
                    job_data.update(self._scrape_naukri(url))
            elif post_text:
                job_data.update(self._analyze_post_text(post_text))

            # Fill in missing fields with intelligent parsing
            self._enrich_job_data(job_data)
            
            return job_data

        except Exception as e:
            print(f"Error scraping job: {str(e)}")
            return None

    def _scrape_internshala(self, soup):
        data = {}
        try:
            # Basic information
            data['job_title'] = self.clean_text(soup.find('h1', {'class': 'heading_2_4 heading_title'}).text)

            logo_container = soup.find('div', {'class': 'internship_logo'})
            data['company_logo'] = 1 if logo_container else 0
            data['has_company_logo'] = 1 if logo_container and logo_container.find('img') else 0  # Check if <img> exists
            
            # Location
            location_elem = soup.find('div', {'id': 'location_names'})
            if location_elem:
                data['job_location'] = self.clean_text(location_elem.text)
            
            # Job details
            details_container = soup.find('div', {'class': 'text-container'})
            if details_container:
                details_text = details_container.text
                data['job_description'] = self.clean_text(details_text)
                
                # Extract stipend/salary
                stipend_elem = soup.find('span', {'class': 'stipend'})
                if stipend_elem:
                    data['range_of_salary'] = self.clean_text(stipend_elem.text)
                
                # Extract requirements
                if 'requirements' in details_text.lower():
                    req_section = details_text.split('requirements', 1)[1].split('\n\n')[0]
                    data['requirements'] = self.clean_text(req_section)
                
                # Check for remote work
                data['telecommunication'] = 1 if any(word in details_text.lower() 
                    for word in ['remote', 'work from home', 'wfh']) else 0
                
                # Extract employment type
                if 'internship' in details_text.lower():
                    data['type_of_employment'] = 'Internship'
                elif 'full time' in details_text.lower():
                    data['type_of_employment'] = 'Full-Time'
                
            # Additional details
            additional_details = soup.find('div', {'class': 'additional_details'})
            if additional_details:
                # Extract experience
                data['experience'] = self.extract_experience(additional_details.text)
                
                # Extract qualifications
                if 'qualification' in additional_details.text.lower():
                    qual_section = additional_details.text.split('qualification', 1)[1].split('\n')[0]
                    data['qualification'] = self.clean_text(qual_section)
            
        except Exception as e:
            print(f"Error in Internshala scraping: {str(e)}")
        return data
    

    def _analyze_post_text(self, post_text):
        """Analyze plain text job posting using the chatbot"""
        data = {}
        try:
            # Get the extracted data from the chatbot
            extracted_data = get_chatbot_response(self.chatbot, post_text)
            print("Chatbot Response:", extracted_data)  # Debugging: Print raw response

            # Check if the response contains a valid list (square brackets)
            if "[" in extracted_data and "]" in extracted_data:
                try:
                    # Extract the JSON-like array using regex
                    array_pattern = re.search(r'\[.*\]', extracted_data, re.DOTALL)
                    if array_pattern:
                        array_content = array_pattern.group(0)  # Extract matched list
                        extracted_values = json.loads(array_content)  # Convert to Python list
                    else:
                        print("No valid list format found in chatbot response.")
                        return {}

                except json.JSONDecodeError as e:
                    print(f"Error decoding extracted data: {str(e)}")
                    return {}

                # Predefined keys in correct order
                extracted_keys = [
                    "Job Title", "Job Location", "Department", "Range of Salary",
                    "Profile", "Job Description", "Requirements", "Job Benefits",
                    "Telecommunication", "Company Logo", "Type of Employment",
                    "Experience", "Qualification", "Type of Industry", "Operations"
                ]

                # Ensure values match keys
                while len(extracted_values) < len(extracted_keys):
                    extracted_values.append("")  # Fill missing fields
                extracted_values = extracted_values[:len(extracted_keys)]  # Trim extra values

                # Convert "yes/no" fields to binary
                extracted_values[8] = "1" if str(extracted_values[8]).lower() in ["yes", "true", "1"] else "0"
                extracted_values[9] = "1" if str(extracted_values[9]).lower() in ["yes", "true", "1"] else "0"

                # Create structured dictionary
                extracted_dict = {extracted_keys[i]: extracted_values[i] for i in range(len(extracted_keys))}

                # Map extracted data to structured output
                data = {
                    'job_title': extracted_dict["Job Title"],
                    'job_location': extracted_dict["Job Location"],
                    'department': extracted_dict["Department"],
                    'range_of_salary': extracted_dict["Range of Salary"].replace("Salary range: ", ""),
                    'profile': extracted_dict["Profile"],
                    'job_description': extracted_dict["Job Description"],
                    'requirements': extracted_dict["Requirements"],
                    'job_benefits': extracted_dict["Job Benefits"],
                    'telecommunication': int(extracted_dict["Telecommunication"]),
                    'company_logo': int(extracted_dict["Company Logo"]),
                    'type_of_employment': extracted_dict["Type of Employment"],
                    'experience': extracted_dict["Experience"],
                    'qualification': extracted_dict["Qualification"],
                    'type_of_industry': extracted_dict["Type of Industry"],
                    'operations': extracted_dict["Operations"]
                }
            else:
                print("No square brackets found in chatbot response.")

        except Exception as e:
            print(f"Error in post text analysis: {str(e)}")

        return data



    def _enrich_job_data(self, job_data):
        """Enrich job data with intelligent parsing"""
        # If profile is empty but we have job title, use it as profile
        if not job_data['profile'] and job_data['job_title']:
            job_data['profile'] = job_data['job_title']
        
        # Try to determine industry type from job description
        if not job_data['type_of_industry'] and job_data['job_description']:
            industries = ['IT', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail']
            for industry in industries:
                if industry.lower() in job_data['job_description'].lower():
                    job_data['type_of_industry'] = industry
                    break
        
        # Try to determine operations from job description
        if not job_data['operations'] and job_data['job_description']:
            operations = ['Customer Service', 'Sales', 'Support', 'Development', 'Research']
            for operation in operations:
                if operation.lower() in job_data['job_description'].lower():
                    job_data['operations'] = operation
                    break
        
        # Try to determine department if empty
        if not job_data['department'] and job_data['job_title']:
            departments = {
                'IT': ['developer', 'engineer', 'programmer'],
                'HR': ['hr', 'human resources', 'recruitment'],
                'Marketing': ['marketing', 'brand', 'social media'],
                'Sales': ['sales', 'business development'],
                'Finance': ['finance', 'accounts', 'accounting']
            }
            for dept, keywords in departments.items():
                if any(keyword in job_data['job_title'].lower() for keyword in keywords):
                    job_data['department'] = dept
                    break
        
        # Ensure all fields have at least an empty string
        for key in job_data:
            if job_data[key] is None:
                job_data[key] = ''



    def _scrape_naukri(self, url):
        data = {}
        try:
            with sync_playwright() as pw:
                # Launch the browser in headless mode
                browser = pw.firefox.launch(headless=True)
                page = browser.new_page()
                
                # Navigate to the URL
                page.goto(url, timeout=60000)  # Increased timeout for dynamic loading
                
                # Wait for the page to load completely
                page.wait_for_selector('body', timeout=10000)
                
                # Extract the entire page content
                content = page.content()
                
                # Close the browser
                browser.close()
                
                # Clean the content: Remove HTML tags, extra spaces, and newlines
                cleaned_content = self._clean_html_content(content)
                
                # Pass the cleaned content to _analyze_naukri_content for restructuring
                data = self._analyze_naukri_content(cleaned_content)
        
        except Exception as e:
            print(f"Error scraping Website: {str(e)}")
        
        return data


    
    def _clean_html_content(self, html_content):
        """
        Clean HTML content by removing tags, extra spaces, and newline characters.
        """
        try:
            # Use BeautifulSoup to parse the HTML and extract text
            soup = BeautifulSoup(html_content, 'html.parser')
            text = soup.get_text(separator=' ')  # Extract text with spaces as separators
            
            # Remove extra spaces and newlines using regex
            cleaned_text = re.sub(r'\s+', ' ', text).strip()  # Replace multiple spaces/newlines with a single space
            
            return cleaned_text
        except Exception as e:
            print(f"Error cleaning HTML content: {str(e)}")
            return html_content  # Return original content if cleaning fails


    def _analyze_naukri_content(self, post_text):
        """Analyze plain text job posting using the chatbot"""
        data = {}
        try:
            # Get the extracted data from the chatbot
            extracted_data = get_chatbot_response(self.chatbot, post_text)
            print("Chatbot Response:", extracted_data)  # Debugging: Print the raw response

            # Check if a square bracket exists in the response
            if "[" in extracted_data and "]" in extracted_data:
                # Use regex to find the array in the chatbot response
                array_pattern = re.compile(r'\[.*\]')
                array_match = array_pattern.search(extracted_data)
                
                if array_match:
                    array_content = array_match.group(0)
                    
                    try:
                        # Safely evaluate the array string into a Python list
                        extracted_values = ast.literal_eval(array_content)

                        # Predefined keys in the correct order
                        extracted_keys = [
                            "Job Title", "Job Location", "Department", "Range of Salary",
                            "Profile", "Job Description", "Requirements", "Job Benefits",
                            "Telecommunication", "Company Logo", "Type of Employment",
                            "Experience", "Qualification", "Type of Industry", "Operations"
                        ]

                        # Handle missing or extra values
                        while len(extracted_values) < len(extracted_keys):
                            extracted_values.append("")  # Fill missing fields with empty strings
                        extracted_values = extracted_values[:len(extracted_keys)]  # Trim extra values if any

                        # Convert Telecommunication & Company Logo to 0 or 1
                        extracted_values[8] = "1" if str(extracted_values[8]).lower() in ["yes", "true", "1"] else "0"
                        extracted_values[9] = "1" if str(extracted_values[9]).lower() in ["yes", "true", "1"] else "0"

                        # Create a structured dictionary
                        extracted_dict = {extracted_keys[i]: extracted_values[i] for i in range(len(extracted_keys))}

                        # Map extracted data to structured output
                        data = {
                            'job_title': extracted_dict["Job Title"],
                            'job_location': extracted_dict["Job Location"],
                            'department': extracted_dict["Department"],
                            'range_of_salary': extracted_dict["Range of Salary"].replace("Salary range: ", ""),  # Clean salary range
                            'profile': extracted_dict["Profile"],
                            'job_description': extracted_dict["Job Description"],
                            'requirements': extracted_dict["Requirements"],
                            'job_benefits': extracted_dict["Job Benefits"],
                            'telecommunication': int(extracted_dict["Telecommunication"]),
                            'company_logo': int(extracted_dict["Company Logo"]),
                            'type_of_employment': extracted_dict["Type of Employment"],
                            'experience': extracted_dict["Experience"],
                            'qualification': extracted_dict["Qualification"],
                            'type_of_industry': extracted_dict["Type of Industry"],
                            'operations': extracted_dict["Operations"]
                        }
                    except Exception as e:
                        print(f"Error parsing extracted data: {str(e)}")
                        data = {}  # Ensure data is empty if parsing fails
                else:
                    print("No valid array found in the chatbot response.")
            else:
                print("No square brackets found in the chatbot response.")

        except Exception as e:
            print(f"Error in post text analysis: {str(e)}")

        return data
