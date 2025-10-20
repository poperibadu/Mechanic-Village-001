
import asyncio
import http.server
import socketserver
import threading
import pytest
from playwright.async_api import async_playwright, expect

# --- Test Configuration ---
PORT = 8009
BASE_URL = f"http://localhost:{PORT}"
EXPECTED_PRODUCT_TITLE = "Premium Brake Pads Set"
# The mock product's ID is 1, so the request path should contain 'inventory/1'
EXPECTED_REQUEST_PATH = "inventory/1"

# --- Server Fixture ---
@pytest.fixture(scope="session")
def http_server():
    """Starts a simple HTTP server in a separate thread for the test session."""
    handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", PORT), handler)
    print(f"Serving at port {PORT}")
    thread = threading.Thread(target=httpd.serve_forever)
    thread.daemon = True
    thread.start()
    yield
    print("Shutting down server.")
    httpd.shutdown()

# --- Test Case ---
@pytest.mark.asyncio
async def test_view_count_update_request(http_server):
    """
    This test verifies that when a user clicks on a product, the application
    sends a request to the correct Firestore collection ('inventory') to update
    the view count.
    """
    request_info = {"intercepted": False, "path": ""}

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        async def handle_route(route):
            """Intercepts network requests to find the view count update."""
            if "firestore.googleapis.com" in route.request.url and "UpdateDocument" in route.request.url:
                request_info["intercepted"] = True
                request_info["path"] = route.request.url.split('v1/')[1]
            await route.continue_()

        await page.route("**/*", handle_route)

        try:
            # 1. Arrange: Navigate to the page and force mock data to load
            await page.goto(BASE_URL)

            # Close the chatbot popup to prevent it from intercepting clicks
            await page.click('.chatbot-toggle')
            await page.wait_for_selector('.chatbot-window:not(.active)', timeout=2000)

            await page.click('.hero-browse-btn')
            await page.evaluate('loadListingsFromMock()')

            # 2. Act: Click on the product card
            product_card = page.locator(f'#listings-grid .listing-card:has-text("{EXPECTED_PRODUCT_TITLE}")')
            await product_card.wait_for(state="visible", timeout=5000)
            await product_card.click()

            # Wait for the detail page to appear to ensure the click was successful
            await expect(page.locator("#detail")).to_be_visible()

            # Give the async Firestore call a moment to fire
            await page.wait_for_timeout(1000)

        finally:
            await browser.close()

    # 3. Assert: Verify the correct network request was sent
    assert request_info["intercepted"], "No Firestore update request was intercepted."
    assert EXPECTED_REQUEST_PATH in request_info["path"], \
        f"Request was sent to the wrong path. Expected '{EXPECTED_REQUEST_PATH}', but got '{request_info['path']}'."
