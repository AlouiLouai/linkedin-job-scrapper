from flask import Flask, request, jsonify
import subprocess
import csv
import os
import logging

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)

@app.route('/fetch_jobs', methods=['POST'])
def fetch_jobs():
    # Retrieve parameters from the request body
    try:
        search_term = request.json.get('search_term')
        location = request.json.get('location')
        site = request.json.get('site', 'linkedin')  # Default to 'linkedin' if not provided
        results_wanted = request.json.get('results_wanted', 100)  # Default to 100 if not provided
        distance = request.json.get('distance', 25)  # Default to 25 if not provided
        job_type = request.json.get('job_type', 'fulltime')  # Default to 'fulltime' if not provided
        country = request.json.get('country', 'UK')  # Default to 'UK' if not provided
        batch_size = request.json.get('batch_size', 30)  # Default to 30 if not provided
        output_dir = request.json.get('output_dir', 'data')  # Default to 'data' if not provided

        # Validate input types
        if not isinstance(search_term, str) or not isinstance(location, str):
            return jsonify({"error": "search_term and location must be strings."}), 400
        if not isinstance(results_wanted, int) or results_wanted <= 0:
            return jsonify({"error": "results_wanted must be a positive integer."}), 400

    except KeyError as e:
        return jsonify({"error": f"Missing required parameter: {str(e)}"}), 400

    # Retrieve pagination parameters from the URL path
    page = request.args.get('page', 1, type=int)  # Default to page 1
    per_page = request.args.get('per_page', 10, type=int)  # Default to 10 per page

    # Command to run the jobsparser
    command = [
        'jobsparser',
        '--search-term', search_term,
        '--location', location,
        '--site', site,
        '--results-wanted', str(results_wanted),
        '--distance', str(distance),
        '--job-type', job_type,
        '--country', country,
        '--batch-size', str(batch_size),
        '--output-dir', output_dir
    ]

    # Execute the command to fetch job data and save it as a .csv file
    try:
        subprocess.run(command, check=True, text=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        logging.error(f"Error running jobsparser: {e.stderr}")
        return jsonify({"error": f"Error running jobsparser: {e.stderr}"}), 500

    # Get the latest CSV file in the output directory
    try:
        # List files and filter for .csv files
        files = [f for f in os.listdir(output_dir) if f.endswith('.csv')]
        if not files:
            return jsonify({"error": "No CSV file found in the output directory"}), 404

        # Sort the files by modification time to get the latest one
        latest_csv_file = max(files, key=lambda f: os.path.getmtime(os.path.join(output_dir, f)))
        latest_csv_file_path = os.path.join(output_dir, latest_csv_file)
    except Exception as e:
        logging.error(f"Error finding the latest CSV file: {str(e)}")
        return jsonify({"error": f"Error finding the latest CSV file: {str(e)}"}), 500

    job_list = []

    # Open and read the CSV file
    try:
        with open(latest_csv_file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            # Extract job details and append to job_list
            for row in reader:
                job_data = {
                    'job_title': row.get('title'),
                    'company_name': row.get('company'),
                    'job_description': row.get('description', 'Description not available'),
                    'job_url': row.get('job_url', 'URL not available')  # Optional field for job URL
                }
                job_list.append(job_data)
    except FileNotFoundError:
        logging.error(f"CSV file not found: {latest_csv_file_path}")
        return jsonify({"error": "CSV file not found"}), 404
    except Exception as e:
        logging.error(f"Error reading the CSV file: {str(e)}")
        return jsonify({"error": f"Error reading the CSV file: {str(e)}"}), 500

    # If results_wanted is more than 10, paginate the results
    if results_wanted > 10:
        try:
            # Calculate the start and end indices for the page
            if page < 1:
                return jsonify({"error": "Page number must be greater than 0"}), 400

            # Determine pagination limits
            total_results = len(job_list)
            total_pages = (total_results + per_page - 1) // per_page  # ceil(total_results / per_page)

            # Validate page number
            if page > total_pages:
                return jsonify({"error": f"Page {page} out of range. Total pages: {total_pages}"}), 400

            # Calculate the subset of job list for the current page
            start_index = (page - 1) * per_page
            end_index = min(start_index + per_page, total_results)

            paginated_jobs = job_list[start_index:end_index]

            # Return paginated results
            return jsonify({
                "page": page,
                "total_pages": total_pages,
                "per_page": per_page,
                "total_results": total_results,
                "jobs": paginated_jobs
            })

        except Exception as e:
            logging.error(f"Pagination error: {str(e)}")
            return jsonify({"error": f"Pagination error: {str(e)}"}), 500
    else:
        # If results_wanted is 10 or less, return all jobs without pagination
        return jsonify(job_list)


if __name__ == '__main__':
    app.run(debug=True)
