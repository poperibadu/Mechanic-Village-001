import asyncio
import re
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Capture and print console logs for debugging
            page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

            # Let the request fail naturally due to sandbox network restrictions
            await page.goto("http://localhost:8000")

            # 1. Set user as logged in to bypass the login modal for the "Buy Now" flow.
            await page.evaluate("""() => {
                isLoggedIn = true;
                currentUser = {
                    uid: 'test_user_uid',
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'customer',
                    location: 'Lagos'
                };
                updateAuthUI();
            }""")

            # The page should now display mock listings.
            # 2. Wait for a listing card to appear and click it.
            listing_card = page.locator(".listing-card").first
            await expect(listing_card).to_be_visible(timeout=10000)
            await listing_card.click()

            # 3. Wait for the detail page to load.
            await expect(page.locator("#detail-title")).to_be_visible()

            # 4. Handle the 'confirm' and 'alert' dialogs that appear during purchase.
            dialog_messages = []
            page.on("dialog", lambda dialog: dialog_messages.append(dialog.message) or dialog.accept())

            # 5. Click the "Buy Now" button.
            await page.locator("text=Buy Now").click()

            # 6. Wait for the dialogs to be processed.
            await page.wait_for_timeout(2000)

            # 7. Verify the order was "created" by checking the dialog messages.
            # The first dialog should be a purchase confirmation.
            assert any("Confirm purchase?" in msg for msg in dialog_messages), "Confirmation dialog did not appear."
            # After our bug fix, the success alert should follow.
            assert any("Order created successfully!" in msg for msg in dialog_messages), "Success alert did not appear."

            print("✅ Test passed: 'Buy Now' functionality is working correctly after the fix.")
            await page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"❌ Test failed: {e}")
            await page.screenshot(path="jules-scratch/verification/verification_error.png")
            raise

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
