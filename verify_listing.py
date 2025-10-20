
import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Listen for all console events and print them
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        try:
            # Navigate to the app
            await page.goto("http://localhost:8000")

            # --- Sign up a new mechanic user ---
            await page.click('text=Sign Up')
            await page.wait_for_selector('#signup-modal.active')

            # Generate unique user credentials to avoid conflicts
            email = f"mechanic_{int(time.time())}@test.com"

            await page.fill('#signup-name', 'Test Mechanic')
            await page.fill('#signup-email', email)
            await page.fill('#signup-phone', '1234567890')
            await page.fill('#signup-password', 'password123')
            await page.select_option('#signup-role', 'mechanic')
            await page.select_option('#signup-location', 'lagos')

            # Add a small delay to ensure form values are processed
            await page.wait_for_timeout(500)

            # Use a dialog handler to accept the alert
            page.on('dialog', lambda dialog: dialog.accept())

            await page.click('#signup-modal button[type="submit"]')

            # Wait for signup to complete and UI to update
            await page.wait_for_selector('#auth-buttons-user', timeout=10000)

            # --- Create a new listing ---
            await page.click('text=Profile')
            await page.wait_for_selector('#profile.active')

            await page.click('#create-listing-btn')
            await page.wait_for_selector('#create-listing-page.active')

            listing_name = "Test Product - Brake Discs"
            await page.fill('#listing-name', listing_name)
            await page.fill('#listing-description', 'A set of high-quality brake discs.')
            await page.fill('#listing-price', '30000')

            await page.click('#create-listing-page button[type="submit"]')

            # The page should redirect to the profile after creation
            await page.wait_for_selector('#profile.active')

            # --- Verify the listing appears on the listings page ---
            await page.click('text=Parts')
            await page.wait_for_selector('#listings.active')

            # Wait for listings to be loaded from Firestore
            await page.wait_for_timeout(3000) # Wait for Firestore to update

            # Check if the listing is visible on the page
            listing_visible = await page.is_visible(f'text={listing_name}')

            if listing_visible:
                print("Verification successful: New listing is visible on the page.")
            else:
                print("Verification failed: New listing not found on the page.")

            # Take a screenshot for visual confirmation
            await page.screenshot(path='new_listing_verification.png')
            print("Screenshot saved as new_listing_verification.png")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
            await page.screenshot(path='verification_error.png')
            print("Error screenshot saved as verification_error.png")

        finally:
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
