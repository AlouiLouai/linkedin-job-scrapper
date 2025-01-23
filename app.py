from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from jobspy import scrape_jobs

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)


@app.route('/fetch_jobs', methods=['POST'])
def fetch_jobs():
    try:
        # Retrieve parameters from the request body
        search_term = request.json.get('search_term', '')
        location_string = request.json.get('location', '')
        results_wanted = 10
        distance = request.json.get('distance', 25)
        job_type = request.json.get('job_type', None)
        hours_old = request.json.get('hours_old', 72)
        page = request.json.get('page', 1)
        per_page = request.json.get('per_page', 10)

        # Log the scraping parameters
        logging.info(f"Scraping jobs with parameters: search_term={search_term}, location={location_string}, "
                     f"results_wanted={results_wanted}, distance={distance}, job_type={job_type}, "
                     f"hours_old={hours_old}, page={page}, per_page={per_page}")

        # Perform the job scraping
        jobs = scrape_jobs(
            site_name=['linkedin'],
            search_term=search_term,
            location=location_string,  # Pass the original location string for scraping
            results_wanted=results_wanted,
            distance=distance,
            job_type=job_type,
            hours_old=hours_old,
            linkedin_fetch_description=True,
            verbose=1
        )

        # Convert results to a list of dictionaries
        job_list = jobs.to_dict(orient='records') if not jobs.empty else []

        # Construct the job data
        processed_jobs = []
        for row in job_list:
            # Use the parsed location object for each job
            job_data = {
                'job_title': row.get('title'),
                'company_name': row.get('company'),
                'company_url': row.get('company_url'),
                'location': row.get('location'),
                'job_description': row.get('description', 'Description not available'),
                'job_url': row.get('job_url', 'URL not available'),
            }
            processed_jobs.append(job_data)

        # Pagination calculations
        total_results = len(processed_jobs)
        total_pages = (total_results + per_page - 1) // per_page  # Calculate total pages
        start_index = (page - 1) * per_page
        end_index = start_index + per_page
        paginated_jobs = processed_jobs[start_index:end_index]

        # Return the paginated results as JSON
        return jsonify({
            "page": page,
            "total_pages": total_pages,
            "per_page": per_page,
            "total_results": total_results,
            "jobs": paginated_jobs
        })

    except Exception as e:
        logging.error(f"Error during job scraping: {e}")
        return jsonify({"error": f"Error during job scraping: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
