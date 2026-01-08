"""
Playwright test script for Recruiter Hub
Tests core pages and functionality
"""
from playwright.sync_api import sync_playwright
import sys

def test_app():
    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("\n=== Testing Recruiter Hub ===\n")

        # Test 1: Home page
        print("1. Testing Home Page...")
        try:
            page.goto("http://localhost:3000")
            page.wait_for_load_state("networkidle")

            # Check for key elements
            title = page.locator("h1").first.text_content()
            if "Recruiter" in title:
                print("   ✓ Home page loads with correct title")
            else:
                errors.append(f"Home page title unexpected: {title}")

            # Check for Get Started button
            get_started = page.locator("text=Get Started").first
            if get_started.is_visible():
                print("   ✓ Get Started button visible")
            else:
                errors.append("Get Started button not visible")

            page.screenshot(path="/tmp/home.png")
            print("   ✓ Screenshot saved: /tmp/home.png")
        except Exception as e:
            errors.append(f"Home page error: {str(e)}")

        # Test 2: Dashboard page
        print("\n2. Testing Dashboard...")
        try:
            page.goto("http://localhost:3000/dashboard")
            page.wait_for_load_state("networkidle")

            # Check for welcome message
            welcome = page.locator("text=Welcome back").first
            if welcome.is_visible():
                print("   ✓ Dashboard loads with welcome message")

            # Check sidebar exists
            sidebar = page.locator("aside").first
            if sidebar.is_visible():
                print("   ✓ Sidebar navigation visible")

            page.screenshot(path="/tmp/dashboard.png")
            print("   ✓ Screenshot saved: /tmp/dashboard.png")
        except Exception as e:
            errors.append(f"Dashboard error: {str(e)}")

        # Test 3: Content Library
        print("\n3. Testing Content Library...")
        try:
            page.goto("http://localhost:3000/content")
            page.wait_for_load_state("networkidle")

            title = page.locator("h1").first.text_content()
            if "Content Library" in title:
                print("   ✓ Content Library page loads")

            # Check for search input
            search = page.locator("input[placeholder*='Search']").first
            if search.is_visible():
                print("   ✓ Search input visible")

            page.screenshot(path="/tmp/content.png")
            print("   ✓ Screenshot saved: /tmp/content.png")
        except Exception as e:
            errors.append(f"Content Library error: {str(e)}")

        # Test 4: Learning Paths
        print("\n4. Testing Learning Paths...")
        try:
            page.goto("http://localhost:3000/learn")
            page.wait_for_load_state("networkidle")

            title = page.locator("h1").first.text_content()
            if "Learning" in title:
                print("   ✓ Learning Paths page loads")

            # Check for onboarding path
            onboarding = page.locator("text=New Recruiter Onboarding").first
            if onboarding.is_visible():
                print("   ✓ Onboarding path visible")

            page.screenshot(path="/tmp/learn.png")
            print("   ✓ Screenshot saved: /tmp/learn.png")
        except Exception as e:
            errors.append(f"Learning Paths error: {str(e)}")

        # Test 5: Experts Directory
        print("\n5. Testing Experts Directory...")
        try:
            page.goto("http://localhost:3000/experts")
            page.wait_for_load_state("networkidle")

            title = page.locator("h1").first.text_content()
            if "Expert" in title:
                print("   ✓ Experts page loads")

            page.screenshot(path="/tmp/experts.png")
            print("   ✓ Screenshot saved: /tmp/experts.png")
        except Exception as e:
            errors.append(f"Experts error: {str(e)}")

        # Test 6: Q&A
        print("\n6. Testing Q&A...")
        try:
            page.goto("http://localhost:3000/qa")
            page.wait_for_load_state("networkidle")

            title = page.locator("h1").first.text_content()
            if "Q&A" in title:
                print("   ✓ Q&A page loads")

            # Check for Ask Question button
            ask_btn = page.locator("text=Ask Question").first
            if ask_btn.is_visible():
                print("   ✓ Ask Question button visible")

            page.screenshot(path="/tmp/qa.png")
            print("   ✓ Screenshot saved: /tmp/qa.png")
        except Exception as e:
            errors.append(f"Q&A error: {str(e)}")

        # Test 7: Leaderboard
        print("\n7. Testing Leaderboard...")
        try:
            page.goto("http://localhost:3000/leaderboard")
            page.wait_for_load_state("networkidle")

            title = page.locator("h1").first.text_content()
            if "Leaderboard" in title:
                print("   ✓ Leaderboard page loads")

            page.screenshot(path="/tmp/leaderboard.png")
            print("   ✓ Screenshot saved: /tmp/leaderboard.png")
        except Exception as e:
            errors.append(f"Leaderboard error: {str(e)}")

        # Test 8: AI Copilot
        print("\n8. Testing AI Copilot...")
        try:
            page.goto("http://localhost:3000/ai")
            page.wait_for_load_state("networkidle")

            title = page.locator("h1").first.text_content()
            if "AI" in title or "Copilot" in title:
                print("   ✓ AI Copilot page loads")

            page.screenshot(path="/tmp/ai.png")
            print("   ✓ Screenshot saved: /tmp/ai.png")
        except Exception as e:
            errors.append(f"AI Copilot error: {str(e)}")

        # Test 9: Profile
        print("\n9. Testing Profile...")
        try:
            page.goto("http://localhost:3000/profile")
            page.wait_for_load_state("networkidle")

            # Check for user name
            name = page.locator("text=Demo User").first
            if name.is_visible():
                print("   ✓ Profile page loads with user info")

            page.screenshot(path="/tmp/profile.png")
            print("   ✓ Screenshot saved: /tmp/profile.png")
        except Exception as e:
            errors.append(f"Profile error: {str(e)}")

        # Test 10: Auth page
        print("\n10. Testing Auth/Sign In...")
        try:
            page.goto("http://localhost:3000/auth/signin")
            page.wait_for_load_state("networkidle")

            # Check for Google sign in button
            google_btn = page.locator("text=Continue with Google").first
            if google_btn.is_visible():
                print("   ✓ Sign in page loads with Google button")

            page.screenshot(path="/tmp/signin.png")
            print("   ✓ Screenshot saved: /tmp/signin.png")
        except Exception as e:
            errors.append(f"Auth error: {str(e)}")

        browser.close()

        # Summary
        print("\n=== Test Summary ===")
        if errors:
            print(f"\n❌ {len(errors)} error(s) found:")
            for err in errors:
                print(f"   - {err}")
            sys.exit(1)
        else:
            print("\n✓ All tests passed!")
            print("\nScreenshots saved to /tmp/")
            sys.exit(0)

if __name__ == "__main__":
    test_app()
