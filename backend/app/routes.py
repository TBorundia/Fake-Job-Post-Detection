# from flask import Blueprint, request, jsonify
# from app.scraper import JobScraper

# main = Blueprint('main', __name__)
# scraper = JobScraper()

# @main.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "Backend is running"}), 200

# @main.route('/api/analyze2', methods=['POST'])
# def analyze_job():

#     data = request.get_json()
#     url = data.get('url')
#     job_post = data.get('job_post')
#     has_logo = data.get('has_logo') 
#     experience= data.get('experience')
#     education= data.get('education')
#     employment= data.get('employment')
#     hasQuestion= data.get('hasQuestion')

#     if not url and not job_post:
#         return jsonify({'error': 'Please provide either a URL or job post'}), 400

#     try:
#         if url:
#             job_data = scraper.scrape_job(url=url, has_logo=has_logo , experience=experience, education=education, employment=employment , hasQuestion=hasQuestion)  
#         else:
#             job_data = scraper.scrape_job(post_text=job_post, has_logo=has_logo, experience=experience, education=education, employment=employment , hasQuestion=hasQuestion)  

#         if not job_data:
#             return jsonify({'error': 'Failed to extract job data'}), 400

#         print("Fraudulent value being returned:", job_data.get("fraudulent"))
#         return jsonify(job_data)

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
from flask import Blueprint, request, jsonify
from app.scraper import JobScraper

# Initialize Blueprint
main = Blueprint('main', __name__)

# Initialize JobScraper instance
scraper = JobScraper()


# ✅ Health Check Endpoint
@main.route('/health', methods=['GET'])
def health_check():
    """Simple health check to verify backend is running."""
    return jsonify({"status": "Backend is running"}), 200


# ✅ Analyze Job Endpoint
@main.route('/api/analyze2', methods=['POST'])
def analyze_job():
    """
    Analyze a job post or job URL to determine if it's fraudulent.
    Expects JSON with either 'url' or 'job_post' and additional metadata.
    """

    # Parse incoming JSON data
    data = request.get_json(silent=True)

    # Validate request payload
    if not data:
        return jsonify({"error": "Invalid or missing JSON data"}), 400

    url = data.get('url')
    job_post = data.get('job_post')
    has_logo = data.get('has_logo', False)
    experience = data.get('experience')
    education = data.get('education')
    employment = data.get('employment')
    has_question = data.get('hasQuestion')

    if not url and not job_post:
        return jsonify({"error": "Please provide either a URL or a job post"}), 400

    try:
        # Call scraper based on input type
        if url:
            job_data = scraper.scrape_job(
                url=url,
                has_logo=has_logo,
                experience=experience,
                education=education,
                employment=employment,
                hasQuestion=has_question
            )
        else:
            job_data = scraper.scrape_job(
                post_text=job_post,
                has_logo=has_logo,
                experience=experience,
                education=education,
                employment=employment,
                hasQuestion=has_question
            )

        # Check if scraper returned valid data
        if not job_data:
            return jsonify({"error": "Failed to extract job data"}), 400

        # Log fraudulent prediction in console for debugging
        print(f"[DEBUG] Fraudulent Prediction: {job_data.get('fraudulent')}")

        # Return full job data as JSON
        return jsonify(job_data), 200

    except Exception as e:
        # Log error for debugging
        print(f"[ERROR] Exception occurred: {e}")
        return jsonify({"error": str(e)}), 500


# ✅ Test Route for Browser Testing
@main.route('/test', methods=['GET'])
def test_response():
    """Returns a sample response for testing in the browser."""
    sample_response = {
        "company_logo": 1,
        "department": "",
        "experience": "",
        "fraudulent": "No",
        "job_benefits": "",
        "job_description": "",
        "job_location": "",
        "job_title": "",
        "operations": "",
        "profile": "",
        "qualification": "",
        "range_of_salary": "",
        "requirements": "",
        "telecommunication": 0,
        "type_of_employment": "",
        "type_of_industry": ""
    }
    return jsonify(sample_response), 200
