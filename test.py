import subprocess
import csv

# Command to run
command = [
    'jobsparser',
    '--search-term', 'Frontend Developer',
    '--location', 'London',
    '--site', 'linkedin',
    '--results-wanted', '10',
    '--distance', '25',
    '--job-type', 'fulltime'
]

# Execute the command
subprocess.run(command)

# Path to the CSV file and the output file for job links
csv_file = 'data/jobs_1.csv'
output_file = 'job_links.txt'

# Open the output file in write mode
with open(output_file, mode='w') as out_file:
    # Open and read the CSV file
    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Extract job links from the CSV file and write to the output file
        for row in reader:
            job_url = row['job_url']  # Adjust this key if necessary
            out_file.write(job_url + '\n')

print(f"Job links have been saved to {output_file}")
