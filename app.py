from flask import Flask, request, jsonify
import subprocess
import csv
import os

app = Flask(__name__)

@app.route('/fetch_jobs', methods=['POST'])
def fetch_jobs():
    # Retrieve parameters from the request
    search_term = request.json.get('search_term')
    location = request.json.get('location')
    site = request.json.get('site', 'linkedin')  # Default to 'linkedin' if not provided
    results_wanted = request.json.get('results_wanted', 100)  # Default to 100 if not provided
    distance = request.json.get('distance', 25)  # Default to 25 if not provided
    job_type = request.json.get('job_type', 'fulltime')  # Default to 'fulltime' if not provided
    country = request.json.get('country', 'UK')  # Default to 'UK' if not provided
    batch_size = request.json.get('batch_size', 30)  # Default to 30 if not provided
    output_dir = request.json.get('output_dir', 'data')  # Default to 'data' if not provided


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
        return jsonify({"error": "CSV file not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Error reading the CSV file: {str(e)}"}), 500

    # Return the job details as a JSON response
    return jsonify(job_list)

if __name__ == '__main__':
    app.run(debug=True)
