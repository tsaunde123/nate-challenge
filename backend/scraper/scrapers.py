from selenium.webdriver import Chrome, ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

CHROME_PATH = "/usr/local/bin/chromedriver"


def scrape_page(url):
    text = ""
    options = ChromeOptions()
    options.add_argument(" - incognito")
    options.add_argument("--headless")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")

    with Chrome(executable_path=CHROME_PATH, chrome_options=options) as browser:
        browser.get(url)
        timeout = 10

        try:
            WebDriverWait(browser, timeout).until(
                EC.visibility_of_element_located(
                    (
                        By.TAG_NAME,
                        "body",
                    )
                )
            )
        except TimeoutException:
            print("Timed out waiting for page to load")
            browser.quit()
            return text

        el = browser.find_element_by_tag_name("body")
        text = el.text

    return text
