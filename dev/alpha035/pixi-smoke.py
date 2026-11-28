"""Real PixiJS integration test in Chromium software WebGL (not a GPU benchmark)."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
BASE=(sys.argv[1] if len(sys.argv)>1 else "http://127.0.0.1:8000").rstrip("/")
BUNDLE=Path(sys.argv[2] if len(sys.argv)>2 else "/tmp/rpb-pixi/package/dist/pixi.min.js")
assert BUNDLE.is_file(),BUNDLE
with sync_playwright() as p:
    browser=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
    for device,width,height in [("pc",1366,768),("mobile",393,873)]:
        page=browser.new_page(viewport={"width":width,"height":height},is_mobile=device=="mobile",has_touch=device=="mobile")
        errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        def route(r):
            if r.request.url.startswith(BASE+"/"): r.continue_()
            elif r.request.url=="https://cdn.jsdelivr.net/npm/pixi.js@8.19.0/dist/pixi.min.js": r.fulfill(path=BUNDLE,content_type="application/javascript")
            else: r.abort()
        page.route("**/*",route)
        page.goto(BASE+"/index.html?rpb-pixi=1")
        page.wait_for_function("!!window.CBGame && !!window.RPBPixiNotes")
        page.locator("#rpbIntroSkip").click()
        page.locator("#alphaNoticeContinue").click()
        page.locator('[data-device-choice="'+device+'"]').click()
        expect(page.locator("#boot")).to_have_class(__import__("re").compile("hidden"),timeout=65000)
        if device=="mobile":
            page.locator("#rpbMobileMore").click()
            page.locator('#rpbMobileMenu [data-rpb-open="settingsBtn"]').click()
        else: page.locator("#settingsBtn").click()
        page.locator("#videoEnabled").uncheck()
        page.locator("#saveSettings").click()
        page.locator("#home .lobby-bottom [data-page=play]").click()
        page.locator("#startNormal").click()
        page.wait_for_function("!document.getElementById('game').classList.contains('hidden')",timeout=65000)
        page.wait_for_function("document.getElementById('music').currentTime > .5",timeout=15000)
        page.wait_for_function("RPBPixiNotes.status()==='pixi-webgl'",timeout=15000)
        page.evaluate("document.getElementById('music').currentTime=15.5")
        page.wait_for_function("document.querySelector('#notesLayer.rpb-pixi-active canvas') && document.querySelector('#notesLayer > .note')",timeout=15000)
        expect(page.locator("#notesLayer canvas")).to_be_visible()
        # Exercise the recovery handler deterministically; real driver loss still requires device tests.
        page.locator("#notesLayer canvas").evaluate("(e)=>e.dispatchEvent(new Event('webglcontextlost',{cancelable:true}))")
        page.wait_for_function("RPBPixiNotes.status()==='fallback' && !document.getElementById('notesLayer').classList.contains('rpb-pixi-active')")
        page.wait_for_function("Array.from(document.querySelectorAll('#notesLayer > .note')).some(e=>getComputedStyle(e).visibility==='visible')")
        page.locator("#pauseBtn").click()
        page.locator("#quitBtn").click()
        expect(page.locator("#home")).to_be_visible()
        assert not errors,errors
        print("PASS real PixiJS and fallback",device,width,height,flush=True)
        page.close()
    browser.close()
