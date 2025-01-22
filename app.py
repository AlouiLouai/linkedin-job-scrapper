import asyncio
from flask import Flask, request, jsonify
import os
import subprocess
import logging
from flask_cors import CORS
import pandas as pd
from jobspy import scrape_jobs

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

# Global flag to track scraping status
scraping_in_progress = False

async def run_command_async(command):
    """Run a shell command asynchronously and capture output."""
    try:
        process = await asyncio.create_subprocess_exec(
            *command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        if process.returncode != 0:
            raise subprocess.CalledProcessError(process.returncode, command, stderr)
        return stdout.decode('utf-8'), stderr.decode('utf-8')
    except Exception as e:
        logging.error(f"Error running command: {e}")
        raise

@app.route('/fetch_jobs', methods=['POST'])
async def fetch_jobs():
    global scraping_in_progress

    # Prevent multiple simultaneous scraping sessions
    if scraping_in_progress:
        return jsonify({"error": "Scraping is already in progress. Please try again later."}), 429
    
    scraping_in_progress = True

    try:
        # Retrieve parameters from the request body
        search_term = request.json.get('search_term')
        location = request.json.get('location')
        site = request.json.get('site', 'linkedin')
        results_wanted = request.json.get('results_wanted', 100)
        distance = request.json.get('distance', 25)
        job_type = request.json.get('job_type', 'fulltime')
        country = request.json.get('country', 'UK')
        batch_size = request.json.get('batch_size', 30)
        output_dir = request.json.get('output_dir', 'data')

        # Validate input
        if not isinstance(search_term, str) or not isinstance(location, str):
            return jsonify({"error": "search_term and location must be strings."}), 400
        if not isinstance(results_wanted, int) or results_wanted <= 0:
            return jsonify({"error": "results_wanted must be a positive integer."}), 400

        # Call the scrape_jobs function from JobSpy
        site_name = [site]  # Pass the specific site chosen by the user
        jobs = scrape_jobs(
            search_term=search_term,
            location=location,
            site_name=site_name,
            results_wanted=results_wanted,
            distance=distance,
            job_type=job_type,
            country=country,
            batch_size=batch_size,
            linkedin_fetch_description=True
        )

        # Convert jobs to a pandas DataFrame for easy manipulation
        jobs_df = pd.DataFrame(jobs)

        # Save the DataFrame as a CSV in the output directory
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        latest_csv_file_path = os.path.join(output_dir, 'jobs.csv')
        jobs_df.to_csv(latest_csv_file_path, index=False)

        job_list = []

        # Read the CSV file in a memory-efficient way (streaming)
        try:
            with open(latest_csv_file_path, newline='', encoding='utf-8') as csvfile:
                reader = pd.read_csv(csvfile, iterator=True, chunksize=100)  # Adjust chunk size as needed

                # Get pagination parameters
                page = request.args.get('page', 1, type=int)
                per_page = request.args.get('per_page', 10, type=int)

                if page < 1:
                    scraping_in_progress = False
                    return jsonify({"error": "Page number must be greater than 0"}), 400

                total_results = len(jobs_df)
                total_pages = (total_results + per_page - 1) // per_page

                if page > total_pages:
                    scraping_in_progress = False
                    return jsonify({"error": f"Page {page} out of range. Total pages: {total_pages}"}), 400

                # Skip to the start index of the page
                start_index = (page - 1) * per_page
                end_index = min(start_index + per_page, total_results)

                # Extract the jobs from the chunked CSV reader
                chunk_start = 0
                for chunk in reader:
                    if chunk_start + len(chunk) >= start_index:
                        chunk_data = chunk.iloc[start_index - chunk_start: end_index - chunk_start]
                        for _, row in chunk_data.iterrows():
                            job_data = {
                                'job_title': row.get('title'),
                                'company_name': row.get('company'),
                                'job_description': row.get('description', 'Description not available'),
                                'job_url': row.get('job_url', 'URL not available')
                            }
                            job_list.append(job_data)

                    chunk_start += len(chunk)

                return jsonify({
                    "page": page,
                    "total_pages": total_pages,
                    "per_page": per_page,
                    "total_results": total_results,
                    "jobs": job_list
                })
        except FileNotFoundError:
            scraping_in_progress = False
            logging.error(f"CSV file not found: {latest_csv_file_path}")
            return jsonify({"error": "CSV file not found"}), 404
        except Exception as e:
            scraping_in_progress = False
            logging.error(f"Error reading the CSV file: {str(e)}")
            return jsonify({"error": f"Error reading the CSV file: {str(e)}"}), 500

    except KeyError as e:
        scraping_in_progress = False
        return jsonify({"error": f"Missing required parameter: {str(e)}"}), 400
    except Exception as e:
        scraping_in_progress = False
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    finally:
        # Ensure that scraping is marked as finished after the process is done
        scraping_in_progress = False


if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
