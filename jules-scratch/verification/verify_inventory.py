from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:8000")

    # Mock login
    page.evaluate("""
        isLoggedIn = true;
        currentUser = { uid: 'test-user', name: 'Test User' };
        updateAuthUI();
    """)

    # Navigate to the sell page
    page.click('a[onclick="showPage(\'sell\')"]')

    # Fill out the form
    page.select_option('select#vendor-select', '1')
    page.fill('input#sell-stock-quantity', '10')
    page.fill('input[placeholder="e.g., Premium Brake Pads Set"]', 'Test Product')
    page.fill('input[placeholder="25000"]', '10000')

    # Handle the alert
    page.on("dialog", lambda dialog: dialog.accept())

    # Submit the form
    page.click('button:has-text("List Item")')

    page.reload()

    # Wait for the new product to be displayed
    page.wait_for_selector('text="Test Product"')

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)