
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(
            viewport={'width': 375, 'height': 667},
            is_mobile=True,
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
        )
        page = await context.new_page()

        try:
            # Navigate to the app
            await page.goto("http://localhost:8000")

            # Wait for the page to load
            await page.wait_for_load_state('networkidle')

            # Take a screenshot
            await page.screenshot(path='screenshot_mobile.png')
            print("Screenshot saved as screenshot_mobile.png")

        except Exception as e:
            print(f"An error occurred during verification: {e}")
            await page.screenshot(path='verification_error.png')
            print("Error screenshot saved as verification_error.png")

        finally:
            await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
