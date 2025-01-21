import requests
from bs4 import BeautifulSoup
import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def scrape_linkedin_jobs(job_title, technologies, location, date_posted):
    # Set up Selenium WebDriver (Chrome in this case)
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in headless mode (no GUI)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # LinkedIn URL with parameters
    base_url = "https://www.linkedin.com/jobs/search?"
    search_url = f"{base_url}keywords={job_title}&location={location}&f_TPR=r{date_posted}&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0"

    # Open the URL with Selenium
    driver.get(search_url)
    time.sleep(5)  # Wait for the page to load

    # Parse the page content with BeautifulSoup
    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Find job cards
    job_cards = soup.find_all('li', class_='job-result-card')

    # List to store scraped data
    jobs_data = []

    for job in job_cards:
        try:
            # Extract details for each job
            title = job.find('h3').text.strip()
            company = job.find('h4').text.strip()
            location = job.find('span', class_='job-result-card__location').text.strip()
            link = job.find('a')['href']

            # Filter by technologies (if given)
            if any(tech.lower() in title.lower() for tech in technologies):
                jobs_data.append({
                    'title': title,
                    'company': company,
                    'location': location,
                    'link': link
                })
        except AttributeError:
            continue  # Skip any job card that doesn't have the required details

    driver.quit()  # Close the WebDriver

    # Convert data to DataFrame for better handling
    df = pd.DataFrame(jobs_data)
    return df

if __name__ == "__main__":
    job_title = input("Enter the job title (e.g., Frontend Developer): ")
    technologies = input("Enter technologies (comma separated, e.g., React, Node.js): ").split(",")
    location = input("Enter the job location (e.g., London): ")
    date_posted = input("Enter the date range (e.g., 1 for past day, 7 for past week): ")

    # Scrape LinkedIn jobs
    jobs = scrape_linkedin_jobs(job_title, technologies, location, date_posted)

    # Print the results
    if not jobs.empty:
        print(jobs)
    else:
        print("No jobs found matching the criteria.")
