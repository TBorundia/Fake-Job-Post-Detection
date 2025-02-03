# import requests
# from bs4 import BeautifulSoup
# import re
# import json

# class JobScraper:
#     def __init__(self):
#         self.headers = {
#             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
#         }

#     def extract_salary(self, text):
#         """Extract salary range from text using regex"""
#         if not text:
#             return ''
#         # Match Indian currency format and ranges
#         pattern = r'(?:₹|Rs|INR)\s*[\d,]+(?:\s*-\s*(?:₹|Rs|INR)\s*[\d,]+)?(?:\s*(?:LPA|PA|per annum|annually))?'
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(0) if match else ''

#     def extract_experience(self, text):
#         """Extract experience requirements from text"""
#         if not text:
#             return ''
#         # Match experience patterns like "2-3 years", "2+ years", "fresher"
#         pattern = r'\d+(?:\s*-\s*\d+|\s*\+)?\s*(?:years?|yrs?)|fresher'
#         match = re.search(pattern, text, re.IGNORECASE)
#         return match.group(0) if match else ''

#     def clean_text(self, text):
#         """Clean and normalize text"""
#         if not text:
#             return ''
#         return ' '.join(text.split())

#     def scrape_job(self, url=None, post_text=None):
#         try:
#             # Initialize job data with default values
#             job_data = {
#                 'job_title': '',
#                 'job_location': '',
#                 'department': '',
#                 'range_of_salary': '',
#                 'profile': '',
#                 'job_description': '',
#                 'requirements': '',
#                 'job_benefits': '',
#                 'telecommunication': 0,
#                 'company_logo': 0,
#                 'type_of_employment': '',
#                 'experience': '',
#                 'qualification': '',
#                 'type_of_industry': '',
#                 'operations': '',
#                 'fraudulent': 'No'
#             }

#             if url:
#                 response = requests.get(url, headers=self.headers)
#                 soup = BeautifulSoup(response.text, 'lxml')
                
#                 if 'linkedin.com' in url:
#                     job_data.update(self._scrape_linkedin(soup))
#                 elif 'internshala.com' in url:
#                     job_data.update(self._scrape_internshala(soup))
#                 elif 'naukri.com' in url:
#                     job_data.update(self._scrape_naukri(soup))
#             elif post_text:
#                 job_data.update(self._analyze_post_text(post_text))

#             # Fill in missing fields with intelligent parsing
#             self._enrich_job_data(job_data)
            
#             return job_data

#         except Exception as e:
#             print(f"Error scraping job: {str(e)}")
#             return None

#     def _scrape_linkedin(self, soup):
#         data = {}
#         try:
#             # Basic information
#             data['job_title'] = self.clean_text(soup.find('h1', {'class': 'top-card-layout__title'}).text)
#             data['company_logo'] = 1 if soup.find('img', {'class': 'artdeco-entity-image'}) else 0
            
#             # Location and workplace type
#             location_elem = soup.find('span', {'class': 'top-card-layout__location'})
#             if location_elem:
#                 data['job_location'] = self.clean_text(location_elem.text)
            
#             # Job description and requirements
#             description_elem = soup.find('div', {'class': 'description__text'})
#             if description_elem:
#                 full_text = description_elem.text
#                 data['job_description'] = self.clean_text(full_text)
                
#                 # Extract requirements
#                 if 'requirements' in full_text.lower():
#                     req_section = full_text.split('requirements', 1)[1].split('\n\n')[0]
#                     data['requirements'] = self.clean_text(req_section)
                
#                 # Extract benefits
#                 if 'benefits' in full_text.lower():
#                     benefits_section = full_text.split('benefits', 1)[1].split('\n\n')[0]
#                     data['job_benefits'] = self.clean_text(benefits_section)
                
#                 # Extract salary
#                 data['range_of_salary'] = self.extract_salary(full_text)
                
#                 # Extract experience
#                 data['experience'] = self.extract_experience(full_text)
                
#                 # Check for remote work
#                 data['telecommunication'] = 1 if any(word in full_text.lower() 
#                     for word in ['remote', 'work from home', 'wfh']) else 0
                
#                 # Extract employment type
#                 employment_types = ['full-time', 'part-time', 'contract', 'temporary', 'internship']
#                 for emp_type in employment_types:
#                     if emp_type in full_text.lower():
#                         data['type_of_employment'] = emp_type.title()
#                         break
                
#                 # Extract qualifications
#                 education_keywords = ['bachelor', 'master', 'phd', 'degree', 'diploma']
#                 for keyword in education_keywords:
#                     if keyword in full_text.lower():
#                         data['qualification'] = self.clean_text(full_text.split(keyword, 1)[1].split('.')[0])
#                         break
            
#         except Exception as e:
#             print(f"Error in LinkedIn scraping: {str(e)}")
#         return data

#     def _scrape_internshala(self, soup):
#         data = {}
#         try:
#             # Basic information
#             data['job_title'] = self.clean_text(soup.find('h1', {'class': 'heading_2_4 heading_title'}).text)
#             data['company_logo'] = 1 if soup.find('div', {'class': 'company_logo'}) else 0
            
#             # Location
#             location_elem = soup.find('div', {'id': 'location_names'})
#             if location_elem:
#                 data['job_location'] = self.clean_text(location_elem.text)
            
#             # Job details
#             details_container = soup.find('div', {'class': 'job_description'})
#             if details_container:
#                 details_text = details_container.text
#                 data['job_description'] = self.clean_text(details_text)
                
#                 # Extract stipend/salary
#                 stipend_elem = soup.find('div', {'class': 'stipend'})
#                 if stipend_elem:
#                     data['range_of_salary'] = self.clean_text(stipend_elem.text)
                
#                 # Extract requirements
#                 if 'requirements' in details_text.lower():
#                     req_section = details_text.split('requirements', 1)[1].split('\n\n')[0]
#                     data['requirements'] = self.clean_text(req_section)
                
#                 # Check for remote work
#                 data['telecommunication'] = 1 if any(word in details_text.lower() 
#                     for word in ['remote', 'work from home', 'wfh']) else 0
                
#                 # Extract employment type
#                 if 'internship' in details_text.lower():
#                     data['type_of_employment'] = 'Internship'
#                 elif 'full time' in details_text.lower():
#                     data['type_of_employment'] = 'Full-Time'
                
#             # Additional details
#             additional_details = soup.find('div', {'class': 'additional_details'})
#             if additional_details:
#                 # Extract experience
#                 data['experience'] = self.extract_experience(additional_details.text)
                
#                 # Extract qualifications
#                 if 'qualification' in additional_details.text.lower():
#                     qual_section = additional_details.text.split('qualification', 1)[1].split('\n')[0]
#                     data['qualification'] = self.clean_text(qual_section)
            
#         except Exception as e:
#             print(f"Error in Internshala scraping: {str(e)}")
#         return data

#     def _scrape_naukri(self, soup):
#         data = {}
#         try:
#             # Basic information
#             data['job_title'] = self.clean_text(soup.find('h1', {'class': 'jobTitle'}).text)
#             data['company_logo'] = 1 if soup.find('img', {'class': 'company-logo'}) else 0
            
#             # Location
#             location_elem = soup.find('span', {'class': 'location'})
#             if location_elem:
#                 data['job_location'] = self.clean_text(location_elem.text)
            
#             # Job description
#             jd_elem = soup.find('div', {'class': 'job-description'})
#             if jd_elem:
#                 full_text = jd_elem.text
#                 data['job_description'] = self.clean_text(full_text)
                
#                 # Extract salary
#                 data['range_of_salary'] = self.extract_salary(full_text)
                
#                 # Extract requirements
#                 if 'requirements' in full_text.lower():
#                     req_section = full_text.split('requirements', 1)[1].split('\n\n')[0]
#                     data['requirements'] = self.clean_text(req_section)
                
#                 # Extract benefits
#                 if 'benefits' in full_text.lower():
#                     benefits_section = full_text.split('benefits', 1)[1].split('\n\n')[0]
#                     data['job_benefits'] = self.clean_text(benefits_section)
            
#             # Experience
#             exp_elem = soup.find('span', {'class': 'experience'})
#             if exp_elem:
#                 data['experience'] = self.clean_text(exp_elem.text)
            
#             # Employment type
#             emp_type_elem = soup.find('span', {'class': 'employment-type'})
#             if emp_type_elem:
#                 data['type_of_employment'] = self.clean_text(emp_type_elem.text)
            
#             # Industry type
#             industry_elem = soup.find('span', {'class': 'industry'})
#             if industry_elem:
#                 data['type_of_industry'] = self.clean_text(industry_elem.text)
            
#             # Department/Function
#             function_elem = soup.find('span', {'class': 'function'})
#             if function_elem:
#                 data['department'] = self.clean_text(function_elem.text)
            
#             # Role/Profile
#             role_elem = soup.find('span', {'class': 'role'})
#             if role_elem:
#                 data['profile'] = self.clean_text(role_elem.text)
            
#         except Exception as e:
#             print(f"Error in Naukri scraping: {str(e)}")
#         return data

#     def _analyze_post_text(self, post_text):
#         """Analyze plain text job posting"""
#         data = {}
#         try:
#             lines = post_text.split('\n')
            
#             # Try to identify job title (usually in the first few lines)
#             for line in lines[:3]:
#                 if any(keyword in line.lower() for keyword in ['position', 'role', 'job title', 'opening']):
#                     data['job_title'] = self.clean_text(line.split(':')[-1])
#                     break
            
#             # Extract other information from the text
#             data['range_of_salary'] = self.extract_salary(post_text)
#             data['experience'] = self.extract_experience(post_text)
            
#             # Look for location
#             location_patterns = [
#                 r'location\s*:?\s*(.*?)(?:\n|$)',
#                 r'based in\s*(.*?)(?:\n|$)',
#                 r'job location\s*:?\s*(.*?)(?:\n|$)'
#             ]
#             for pattern in location_patterns:
#                 match = re.search(pattern, post_text, re.IGNORECASE)
#                 if match:
#                     data['job_location'] = self.clean_text(match.group(1))
#                     break
            
#             # Extract requirements section
#             if 'requirements' in post_text.lower():
#                 req_section = post_text.split('requirements', 1)[1].split('\n\n')[0]
#                 data['requirements'] = self.clean_text(req_section)
            
#             # Check for remote work
#             data['telecommunication'] = 1 if any(word in post_text.lower() 
#                 for word in ['remote', 'work from home', 'wfh']) else 0
            
#             # Extract employment type
#             employment_types = ['full-time', 'part-time', 'contract', 'temporary', 'internship']
#             for emp_type in employment_types:
#                 if emp_type in post_text.lower():
#                     data['type_of_employment'] = emp_type.title()
#                     break
            
#         except Exception as e:
#             print(f"Error in post text analysis: {str(e)}")
#         return data

#     def _enrich_job_data(self, job_data):
#         """Enrich job data with intelligent parsing"""
#         # If profile is empty but we have job title, use it as profile
#         if not job_data['profile'] and job_data['job_title']:
#             job_data['profile'] = job_data['job_title']
        
#         # Try to determine industry type from job description
#         if not job_data['type_of_industry'] and job_data['job_description']:
#             industries = ['IT', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail']
#             for industry in industries:
#                 if industry.lower() in job_data['job_description'].lower():
#                     job_data['type_of_industry'] = industry
#                     break
        
#         # Try to determine operations from job description
#         if not job_data['operations'] and job_data['job_description']:
#             operations = ['Customer Service', 'Sales', 'Support', 'Development', 'Research']
#             for operation in operations:
#                 if operation.lower() in job_data['job_description'].lower():
#                     job_data['operations'] = operation
#                     break
        
#         # Try to determine department if empty
#         if not job_data['department'] and job_data['job_title']:
#             departments = {
#                 'IT': ['developer', 'engineer', 'programmer'],
#                 'HR': ['hr', 'human resources', 'recruitment'],
#                 'Marketing': ['marketing', 'brand', 'social media'],
#                 'Sales': ['sales', 'business development'],
#                 'Finance': ['finance', 'accounts', 'accounting']
#             }
#             for dept, keywords in departments.items():
#                 if any(keyword in job_data['job_title'].lower() for keyword in keywords):
#                     job_data['department'] = dept
#                     break
        
#         # Ensure all fields have at least an empty string
#         for key in job_data:
#             if job_data[key] is None:
#                 job_data[key] = ''













import requests
from bs4 import BeautifulSoup
import re
import json

class JobScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

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
                soup = BeautifulSoup(response.text, 'lxml')
                
                if 'linkedin.com' in url:
                    job_data.update(self._scrape_linkedin(soup))
                elif 'internshala.com' in url:
                    job_data.update(self._scrape_internshala(soup))
                elif 'naukri.com' in url:
                    job_data.update(self._scrape_naukri(soup))
            elif post_text:
                job_data.update(self._analyze_post_text(post_text))

            # Fill in missing fields with intelligent parsing
            self._enrich_job_data(job_data)
            
            return job_data

        except Exception as e:
            print(f"Error scraping job: {str(e)}")
            return None

    def _scrape_linkedin(self, soup):
        data = {}
        try:
            # Basic information
            data['job_title'] = self.clean_text(soup.find('h1', {'class': 'top-card-layout__title'}).text)
            data['company_logo'] = 1 if soup.find('img', {'class': 'artdeco-entity-image'}) else 0
            
            # Location and workplace type
            location_elem = soup.find('span', {'class': 'top-card-layout__location'})
            if location_elem:
                data['job_location'] = self.clean_text(location_elem.text)
            
            # Job description and requirements
            description_elem = soup.find('div', {'class': 'description__text'})
            if description_elem:
                full_text = description_elem.text
                data['job_description'] = self.clean_text(full_text)
                
                # Extract requirements
                if 'requirements' in full_text.lower():
                    req_section = full_text.split('requirements', 1)[1].split('\n\n')[0]
                    data['requirements'] = self.clean_text(req_section)
                
                # Extract benefits
                if 'benefits' in full_text.lower():
                    benefits_section = full_text.split('benefits', 1)[1].split('\n\n')[0]
                    data['job_benefits'] = self.clean_text(benefits_section)
                
                # Extract salary
                data['range_of_salary'] = self.extract_salary(full_text)
                
                # Extract experience
                data['experience'] = self.extract_experience(full_text)
                
                # Check for remote work
                data['telecommunication'] = 1 if any(word in full_text.lower() 
                    for word in ['remote', 'work from home', 'wfh']) else 0
                
                # Extract employment type
                employment_types = ['full-time', 'part-time', 'contract', 'temporary', 'internship']
                for emp_type in employment_types:
                    if emp_type in full_text.lower():
                        data['type_of_employment'] = emp_type.title()
                        break
                
                # Extract qualifications
                education_keywords = ['bachelor', 'master', 'phd', 'degree', 'diploma']
                for keyword in education_keywords:
                    if keyword in full_text.lower():
                        data['qualification'] = self.clean_text(full_text.split(keyword, 1)[1].split('.')[0])
                        break
            
        except Exception as e:
            print(f"Error in LinkedIn scraping: {str(e)}")
        return data

    def _scrape_internshala(self, soup):
        data = {}
        try:
            # Basic information
            data['job_title'] = self.clean_text(soup.find('h1', {'class': 'heading_2_4 heading_title'}).text)
            data['company_logo'] = 1 if soup.find('div', {'class': 'company_logo'}) else 0
            
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

    def _scrape_naukri(self, soup):
        data = {}
        try:
            # Basic information
            data['job_title'] = self.clean_text(soup.find('h1', {'class': 'jobTitle'}).text)
            data['company_logo'] = 1 if soup.find('img', {'class': 'company-logo'}) else 0
            
            # Location
            location_elem = soup.find('span', {'class': 'location'})
            if location_elem:
                data['job_location'] = self.clean_text(location_elem.text)
            
            # Job description
            jd_elem = soup.find('div', {'class': 'job-description'})
            if jd_elem:
                full_text = jd_elem.text
                data['job_description'] = self.clean_text(full_text)
                
                # Extract salary
                data['range_of_salary'] = self.extract_salary(full_text)
                
                # Extract requirements
                if 'requirements' in full_text.lower():
                    req_section = full_text.split('requirements', 1)[1].split('\n\n')[0]
                    data['requirements'] = self.clean_text(req_section)
                
                # Extract benefits
                if 'benefits' in full_text.lower():
                    benefits_section = full_text.split('benefits', 1)[1].split('\n\n')[0]
                    data['job_benefits'] = self.clean_text(benefits_section)
            
            # Experience
            exp_elem = soup.find('span', {'class': 'experience'})
            if exp_elem:
                data['experience'] = self.clean_text(exp_elem.text)
            
            # Employment type
            emp_type_elem = soup.find('span', {'class': 'employment-type'})
            if emp_type_elem:
                data['type_of_employment'] = self.clean_text(emp_type_elem.text)
            
            # Industry type
            industry_elem = soup.find('span', {'class': 'industry'})
            if industry_elem:
                data['type_of_industry'] = self.clean_text(industry_elem.text)
            
            # Department/Function
            function_elem = soup.find('span', {'class': 'function'})
            if function_elem:
                data['department'] = self.clean_text(function_elem.text)
            
            # Role/Profile
            role_elem = soup.find('span', {'class': 'role'})
            if role_elem:
                data['profile'] = self.clean_text(role_elem.text)
            
        except Exception as e:
            print(f"Error in Naukri scraping: {str(e)}")
        return data

    def _analyze_post_text(self, post_text):
        """Analyze plain text job posting"""
        data = {}
        try:
            lines = post_text.split('\n')
            
            # Try to identify job title (usually in the first few lines)
            for line in lines[:3]:
                if any(keyword in line.lower() for keyword in ['position', 'role', 'job title', 'opening']):
                    data['job_title'] = self.clean_text(line.split(':')[-1])
                    break
            
            # Extract other information from the text
            data['range_of_salary'] = self.extract_salary(post_text)
            data['experience'] = self.extract_experience(post_text)
            
            # Look for location
            location_patterns = [
                r'location\s*:?\s*(.*?)(?:\n|$)',
                r'based in\s*(.*?)(?:\n|$)',
                r'job location\s*:?\s*(.*?)(?:\n|$)'
            ]
            for pattern in location_patterns:
                match = re.search(pattern, post_text, re.IGNORECASE)
                if match:
                    data['job_location'] = self.clean_text(match.group(1))
                    break
            
            # Extract requirements section
            if 'requirements' in post_text.lower():
                req_section = post_text.split('requirements', 1)[1].split('\n\n')[0]
                data['requirements'] = self.clean_text(req_section)
            
            # Check for remote work
            data['telecommunication'] = 1 if any(word in post_text.lower() 
                for word in ['remote', 'work from home', 'wfh']) else 0
            
            # Extract employment type
            employment_types = ['full-time', 'part-time', 'contract', 'temporary', 'internship']
            for emp_type in employment_types:
                if emp_type in post_text.lower():
                    data['type_of_employment'] = emp_type.title()
                    break
            
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
