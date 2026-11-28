"""Chromium smoke test of the real experimental game (not just lab).
No production Firebase requests; uses existing game assets on localhost.
Run with a checkout served over HTTP. Does not prove hardware FPS or full-song scores.
"""
import sys
from playwright.sync_api import sync_playwright, expect
BASE=(sys.argv[1] if len(sys.argv)>1 else "http://127.0.0.1:8000").rstrip("/")
SIZES=[(360,640,"mobile"),(393,873,"mobile"),(1366,768,"pc"),(1920,1080,"pc")]
with sync_playwright() as p:
    browser=p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
    for width,height,device in SIZES:
        ctx=browser.new_context(viewport={"width":width,"height":height},is_mobile=device=="mobile",has_touch=device=="mobile")
        page=ctx.new_page()
        page.set_default_timeout(15000)
        errors=[]; external=[]
        page.on("pageerror",lambda e: errors.append(str(e)))
        def route_request(route):
            url=route.request.url
            if url.startswith(BASE+"/"): route.continue_()
            else:
                external.append(url)
                route.abort()
        page.route("**/*",route_request)
        page.goto(BASE+"/index.html",wait_until="domcontentloaded")
        page.wait_for_function("!!window.CBGame && !!window.RPBProgress && !!window.RPBGacha")
        assert page.evaluate("window.RPB_DEV_MODE && !CBOnline.configured && !CBOnline.active")
        expect(page.locator("#rpbStudioIntro")).to_be_visible()
        page.locator("#rpbIntroSkip").click()
        expect(page.locator("#alphaNotice")).to_be_visible()
        page.locator("#alphaNoticeContinue").click()
        page.locator('[data-device-choice="'+device+'"]').click()
        expect(page.locator("#boot")).to_have_class(__import__("re").compile("hidden"),timeout=65000)
        expect(page.locator("#home")).to_be_visible()
        def click_page(name):
            if device=="mobile":
                links=page.locator('.rpb-mobile-nav [data-page="'+name+'"]')
                if links.count(): links.click()
                else:
                    page.locator("#rpbMobileMore").click()
                    page.locator('#rpbMobileMenu [data-page="'+name+'"]').click()
            else: page.locator('.sidebar [data-page="'+name+'"]').last.click()
            expect(page.locator("#"+name)).to_have_class(__import__("re").compile("active"))
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1"),(width,height,name,"document overflow")
        if device=="mobile":
            expect(page.locator(".rpb-mobile-nav")).to_be_visible()
            expect(page.locator(".sidebar")).to_be_hidden()
            # Main action must be accessible even if smallest viewport needs slight scroll.
            play=page.locator("#home .lobby-play")
            play.scroll_into_view_if_needed()
            expect(play).to_be_in_viewport()
        else:
            expect(page.locator(".rpb-mobile-nav")).to_be_hidden()
        page.locator("#rpbMissionsOpen").click()
        expect(page.locator("#rpbMissionsDialog")).to_be_visible()
        page.locator('[data-rpb-period="season"]').click()
        assert page.locator("#rpbSeasonTrack .rpb-mission-card").count()==50
        page.locator("#rpbClaimAll").click()
        assert page.evaluate("CBGame.profile().coins")==650
        page.locator("#rpbMissionClose").click()
        click_page("gacha")
        left=page.locator("#gacha .gacha-left").bounding_box();right=page.locator("#gacha .gacha-right").bounding_box()
        if device=="mobile": assert left["y"]+left["height"] <= right["y"]+1,(left,right,"gacha overlap")
        page.locator("#buyTicket").click()
        assert page.evaluate("CBGame.profile().tickets")==1
        page.locator("#spinGacha").click()
        page.locator("#rpbGachaSkip").click()
        assert page.evaluate("CBGame.profile().tickets")==0
        assert page.evaluate("CBGame.profile().gachaHistory.length")==1
        page.locator("#gachaReveal .pull-grid .gacha-item").first.wait_for()
        page.locator("#gachaReveal").evaluate("(e)=>e.classList.add('hidden')")
        for name in ["shop","inventory","profile","versus","play","home"]: click_page(name)
        click_page("versus")
        page.locator("#matchSearch").click()
        expect(page.locator("#queue")).to_be_visible()
        assert page.locator("#queue .rpb-queue-team").count()==2
        page.locator("#cancelQueue").click()
        expect(page.locator("#queue")).to_be_hidden()
        click_page("home")
        if device=="mobile":
            page.locator("#rpbMobileMore").click()
            page.locator('#rpbMobileMenu [data-rpb-open="settingsBtn"]').click()
        else: page.locator("#settingsBtn").click()
        page.locator("#rpbSettingsAccount").click()
        expect(page.locator("#accountDialog")).to_be_visible()
        page.locator('[data-auth-view="register"]').first.click()
        expect(page.locator("#accountRegisterView")).to_be_visible()
        expect(page.locator("#accountLoginView")).to_be_hidden()
        page.locator('#accountRegisterView [data-auth-view="menu"]').click()
        page.locator('[data-auth-view="login"]').first.click()
        page.locator('#accountLoginView [data-auth-view="recover"]').click()
        expect(page.locator("#accountRecoverView")).to_be_visible()
        page.locator("#accountClose").click()
        if width in [393,1366]:
            if device=="mobile":
                page.locator("#rpbMobileMore").click()
                page.locator('#rpbMobileMenu [data-rpb-open="settingsBtn"]').click()
            else: page.locator("#settingsBtn").click()
            page.locator("#videoEnabled").uncheck()
            page.locator("#saveSettings").click()
            click_page("play")
            page.locator("#startNormal").click()
            page.wait_for_function("!document.getElementById('game').classList.contains('hidden') || !document.getElementById('songReady').classList.contains('hidden') || document.getElementById('songLoadStatus').textContent.startsWith('No se pudo cargar')",timeout=65000)
            if page.locator("#songReady").is_visible(): page.locator("#songReady").click()
            assert not page.locator("#songLoadStatus").inner_text().startswith("No se pudo cargar"),page.locator("#songLoadStatus").inner_text()
            expect(page.locator("#game")).to_be_visible()
            page.wait_for_function("document.getElementById(\'music\').currentTime > 0.5",timeout=15000)
            page.locator("#pauseBtn").click()
            expect(page.locator("#pauseOverlay")).to_be_visible()
            page.locator("#quitBtn").click()
            expect(page.locator("#home")).to_be_visible()
            print("PASS audio and practice start/quit",width,height,flush=True)
        assert page.evaluate("localStorage.getItem('cherrybeat04.profile')===null")
        assert not any("firebase" in u or "googleapis" in u for u in external),external
        assert not errors,errors
        print("PASS real game menus",width,height,device,flush=True)
        ctx.close()
    browser.close()
