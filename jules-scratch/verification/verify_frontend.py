
import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading

# --- Test Configuration ---
PORT = 8007
BASE_URL = f"http://localhost:{PORT}"
SCREENSHOT_PATH = "jules-scratch/verification/verification.png"
EXPECTED_PRODUCT_TITLE = "Premium Brake Pads Set"

async def run_verification():
    """Runs the Playwright script to generate a screenshot for visual verification."""
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            print(f"Navigating to {BASE_URL}")
            await page.goto(BASE_URL)

            # Check if the chatbot is open and close it if necessary
            if await page.is_visible('.chatbot-window.active'):
                print("Closing the chatbot popup...")
                await page.click('.chatbot-toggle')
                await page.wait_for_selector('.chatbot-window:not(.active)', timeout=2000)

            print("Clicking 'Browse All Parts' to navigate to the listings page...")
            await page.click('.hero-browse-btn')

            print("Forcing the application to load and display mock data...")
            await page.evaluate('loadListingsFromMock()')

            print("Waiting for the listings page to render...")
            await page.wait_for_selector(f'#listings-grid .listing-card:has-text("{EXPECTED_PRODUCT_TITLE}")', timeout=5000)

            print(f"Clicking on the test product: '{EXPECTED_PRODUCT_TITLE}'")
            await page.click(f'#listings-grid .listing-card:has-text("{EXPECTED_PRODUCT_TITLE}")')

            # Wait for the detail page to be visible
            await page.wait_for_selector('#detail .detail-page', timeout=5000)

            print(f"Taking screenshot and saving to {SCREENSHOT_PATH}...")
            await page.screenshot(path=SCREENSHOT_PATH)

        except Exception as e:
            print(f"An error occurred during the Playwright script: {e}")
            await page.screenshot(path="jules-scratch/verification/verification_error.png")
            return False
        finally:
            await browser.close()

    print("Script finished successfully.")
    return True

# --- Main Execution ---
if __name__ == "__main__":
    server = None
    success = False
    try:
        # Define the handler and server within the main block
        handler = http.server.SimpleHTTPRequestHandler
        httpd = socketserver.TCPServer(("", PORT), handler)
        print(f"Serving at port {PORT}")
        thread = threading.Thread(target=httpd.serve_forever)
        thread.daemon = True
        thread.start()

        success = asyncio.run(run_verification())

    except KeyboardInterrupt:
        print("Stopping server.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        success = False
    finally:
        # Ensure httpd is defined before trying to shut it down
        if 'httpd' in locals() and httpd:
            httpd.shutdown()

    exit(0 if success else 1)
