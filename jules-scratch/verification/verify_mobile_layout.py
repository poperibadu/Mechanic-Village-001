
from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Emulate a mobile device
    context = browser.new_context(**playwright.devices['iPhone 12'])
    page = context.new_page()
    page.goto("http://localhost:8000")

    # Scroll to the footer to ensure the link is in view
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

    # Navigate to the "Contact Us" page
    contact_link = page.locator('.footer-section:has-text("Support") a:has-text("Contact Us")')
    contact_link.click()

    # Add a short delay to allow the page to load
    time.sleep(1)

    # Take a screenshot of the "Contact Us" page
    page.screenshot(path="jules-scratch/verification/contact_us_mobile.png")

    # Open the chatbot
    page.click('.chatbot-toggle')

    # Wait for the chatbot to be visible
    expect(page.locator('.chatbot-window')).to_be_visible()

    # Take a screenshot of the chatbot on the "Contact Us" page
    page.screenshot(path="jules-scratch/verification/contact_us_chatbot_mobile.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
