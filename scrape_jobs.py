from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv

def scrape_linkedin_jobs(email, password, search_term, location, results_wanted):
    # Set up Selenium WebDriver
    options = Options()
    options.add_argument("--start-maximized")
    service = Service(r"C:\Users\louai\Downloads\chromedriver-win64\chromedriver-win64\chromedriver.exe")
    driver = webdriver.Chrome(service=service, options=options)

    driver.implicitly_wait(10)  # Set implicit wait for all elements

    try:
        # Navigate to LinkedIn login page
        driver.get("https://www.linkedin.com/login")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))

        # Enter login credentials
        email_field = driver.find_element(By.ID, "username")
        email_field.send_keys(email)
        password_field = driver.find_element(By.ID, "password")
        password_field.send_keys(password)
        password_field.send_keys(Keys.RETURN)

        # Wait for login to complete
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "global-nav-search")))

        # Navigate to jobs page
        driver.get("https://www.linkedin.com/jobs/")
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "jobs-search-box__text-input")))

        # Use class name to locate the search input box
        search_box_term = driver.find_element(By.CLASS_NAME, "jobs-search-box__text-input")
        search_box_term.send_keys(search_term)

        search_box_location = driver.find_element(By.XPATH, "//input[@aria-label='Location']")
        search_box_location.send_keys(location)
        search_box_location.send_keys(Keys.RETURN)

        # Wait for results to load
        time.sleep(3)

        jobs = []
        for _ in range(results_wanted // 25):
            job_cards = driver.find_elements(By.CLASS_NAME, "jobs-search-results__list-item")

            for job in job_cards:
                try:
                    title = job.find_element(By.CLASS_NAME, "job-card-list__title").text
                    company = job.find_element(By.CLASS_NAME, "job-card-container__company-name").text
                    loc = job.find_element(By.CLASS_NAME, "job-card-container__metadata-item").text
                    link = job.find_element(By.CLASS_NAME, "job-card-list__title").get_attribute("href")

                    jobs.append({"Title": title, "Company": company, "Location": loc, "Link": link})
                except Exception as e:
                    print(f"Error scraping job: {e}")

            # Scroll down and load more results
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)

        return jobs

    finally:
        driver.quit()


def save_jobs_to_csv(jobs, filename="linkedin_jobs.csv"):
    if not jobs:
        print("No jobs to save.")
        return

    keys = jobs[0].keys()
    with open(filename, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=keys)
        writer.writeheader()
        writer.writerows(jobs)

    print(f"Saved {len(jobs)} jobs to {filename}")

if __name__ == "__main__":
    email = "louaialoui1993@gmail.com"
    password = "LouLinkedin1993"
    search_term = "Backend Developer"
    location = "Remote"
    results_wanted = 30

    jobs = scrape_linkedin_jobs(email, password, search_term, location, results_wanted)
    if jobs:
        save_jobs_to_csv(jobs)
    else:
        print("No jobs found.")
