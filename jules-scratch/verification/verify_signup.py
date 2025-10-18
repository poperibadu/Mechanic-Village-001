
import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8000")

    # Click the "Sign Up" button
    page.get_by_role("link", name="Sign Up").click()

    # Wait for the modal to appear
    expect(page.locator("#signup-modal")).to_be_visible()

    # Take a screenshot of the signup modal
    page.screenshot(path="jules-scratch/verification/signup_modal.png")

    # Use a unique email for each run
    unique_email = f"test_user_{int(time.time())}@test.com"

    # Fill out the signup form
    page.locator("#signup-name").fill("Test User")
    page.locator("#signup-email").fill(unique_email)
    page.locator("#signup-phone").fill("1234567890")
    page.locator("#signup-password").fill("password")
    page.locator("#signup-role").select_option("customer")
    page.locator("#signup-location").select_option("lagos")

    # Click the "Create Account" button
    page.get_by_role("button", name="Create Account").click()

    # Wait for the "Welcome" message to appear
    expect(page.locator("#user-name")).to_have_text("Test User")

    # Take a screenshot of the welcome message
    page.screenshot(path="jules-scratch/verification/welcome_message.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
