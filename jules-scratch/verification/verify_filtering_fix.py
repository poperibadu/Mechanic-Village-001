from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:8000")

    # Navigate to the listings page
    page.evaluate("showPage('listings')")
    page.reload()

    # Wait for listings to be loaded
    page.wait_for_selector('.listing-card')

    # Apply a filter
    page.select_option('select#brand-filter', 'bosch')

    # Wait for the filtered results to be displayed
    page.wait_for_timeout(1000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)