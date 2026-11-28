"""Optional real Chromium smoke suite. Start an HTTP server from repo root first.
Usage: python dev/alpha035/browser-smoke.py [base-url]
Install Playwright separately: python -m pip install playwright; python -m playwright install chromium
No Firebase or CDN requests are allowed by the suite.
"""
import sys
from playwright.sync_api import sync_playwright
BASE=(sys.argv[1] if len(sys.argv)>1 else "http://127.0.0.1:8000").rstrip("/")
SIZES=[(360,640),(393,873),(430,932),(873,393),(768,1024),(1366,768),(1920,1080)]
with sync_playwright() as p:
    browser=p.chromium.launch()
    for width,height in SIZES:
        page=browser.new_page(viewport={"width":width,"height":height})
        errors=[]
        page.on("pageerror",lambda error: errors.append(str(error)))
        page.route("**/*",lambda route: route.continue_() if route.request.url.startswith(BASE+"/") else route.abort())
        page.goto(BASE+"/dev/alpha035/")
        page.locator("#homeLevel").wait_for()
        for tab in ["home","gacha","missions","versus","account"]:
            page.locator('[data-tab="'+tab+'"]').click()
            assert page.locator("#"+tab).is_visible(),tab
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"),(width,height,tab,"overflow")
        page.locator('[data-tab="gacha"]').click()
        page.locator("#demoFunds").click()
        page.locator("#pull10").click()
        assert page.locator("#pullResults .result").count()==10
        assert "110 BCR" in page.locator("#crystals").inner_text()
        page.locator('[data-tab="missions"]').click()
        for _ in range(3):
            page.locator("#simulateResult").click()
        page.locator("#claimAll").click()
        assert page.locator("#seasonTrack").is_hidden()
        before=page.locator("#coins").inner_text()
        page.locator("#claimAll").click()
        assert page.locator("#coins").inner_text()==before
        page.locator('[data-period="season"]').click()
        assert page.locator("#seasonTrack .reward").count()==50
        page.locator('[data-period="day"]').click()
        assert page.locator("#seasonTrack").is_hidden()
        page.locator('[data-tab="versus"]').click()
        for n in range(1,6):
            page.locator("#size").select_option(str(n))
            assert page.locator(".slot").count()==2*n
        page.locator("#search").click()
        page.locator("#cancel").click()
        assert page.locator("#cancel").is_hidden()
        assert not errors,errors
        print("PASS lab",width,height)
        page.close()
    browser.close()
