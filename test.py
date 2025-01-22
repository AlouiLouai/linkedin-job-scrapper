from flask import Flask, jsonify, request
import pandas as pd
from jobspy import scrape_jobs

app = Flask(__name__)

@app.route('/scrape-jobs', methods=['GET'])
def scrape_jobs_route():
    # Get query parameters for search
    search_term = request.args.get('search_term', 'software engineer')
    location = request.args.get('location', 'San Francisco, CA')
    results_wanted = int(request.args.get('results_wanted', 20))

    # Define the job sites you want to scrape
    site_name = ["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"]

    # Call scrape_jobs function
    jobs = scrape_jobs(
        site_name=site_name,
        search_term=search_term,
        location=location,
        results_wanted=results_wanted,
    )

    # Convert jobs to a pandas DataFrame for easy manipulation
    jobs_df = pd.DataFrame(jobs)

    # Return jobs as JSON (or you could return as CSV or Excel)
    return jsonify(jobs_df.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
