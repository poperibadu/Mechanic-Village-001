
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto("http://localhost:8000")

        # Desktop screenshot
        await page.set_viewport_size({"width": 1280, "height": 800})
        await page.screenshot(path="screenshot_desktop.png")

        await browser.close()

asyncio.run(main())
