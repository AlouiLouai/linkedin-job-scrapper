from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from jobspy import scrape_jobs

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Global flag to track scraping status
scraping_in_progress = False

@app.route('/fetch_jobs', methods=['POST'])
def fetch_jobs():
    global scraping_in_progress

    # Prevent multiple simultaneous scraping sessions
    if scraping_in_progress:
        return jsonify({"error": "Scraping is already in progress. Please try again later."}), 429
    
    scraping_in_progress = True

    try:
        # Retrieve parameters from the request body
        search_term = request.json.get('search_term', '')
        location = request.json.get('location', '')
        results_wanted = request.json.get('results_wanted', 100)
        distance = request.json.get('distance', 25)
        job_type = request.json.get('job_type', None)
        country = request.json.get('country', 'UK')
        hours_old = request.json.get('hours_old', 72)

        # Log the scraping parameters
        logging.info(f"Scraping jobs with parameters: search_term={search_term}, location={location}, "
                     f"results_wanted={results_wanted}, distance={distance}, job_type={job_type}, "
                     f"country={country}, hours_old={hours_old}")

        # Perform the job scraping
        jobs = scrape_jobs(
            site_name=['linkedin'],
            search_term=search_term,
            location=location,
            results_wanted=results_wanted,
            distance=distance,
            job_type=job_type,
            hours_old=hours_old,
            linkedin_fetch_description=True,
            verbose=1
        )

        # Convert results to a list of dictionaries
        job_list = jobs.to_dict(orient='records') if not jobs.empty else []

        # Return the results as JSON
        return jsonify({
            "status": "success",
            "total_jobs": len(job_list),
            "jobs": job_list
        })
    
    except Exception as e:
        logging.error(f"Error during job scraping: {e}")
        return jsonify({"error": "An error occurred while fetching jobs.", "details": str(e)}), 500
    
    finally:
        scraping_in_progress = False

if __name__ == '__main__':
    app.run(debug=True, port=5000)
