# from playwright.sync_api import sync_playwright

# pw = sync_playwright().start()
# browser = pw.firefox.launch()
# page = browser.new_page()
# page.goto("https://internshala.com/internship/detail/sales-marketing-internship-in-mumbai-at-jrb-eventz1737270224")
# print(page.title())









# from playwright.sync_api import sync_playwright

# with sync_playwright() as pw:
#     browser = pw.firefox.launch(headless=True)  # Set headless=True to run in the background
#     page = browser.new_page()
    
#     page.goto("https://internshala.com/internship/detail/sales-marketing-internship-in-mumbai-at-jrb-eventz1737270224")
    
#     # Extract H1 text
#     h1_text = page.locator("h1.heading_2_4.heading_title").text_content()
    
#     print("Title of the page:", page.title())
#     print("H1 text:", h1_text)
    
#     browser.close()
















# <================= Ye waala Unstop ka working code hai===========================>

# from playwright.sync_api import sync_playwright

# with sync_playwright() as pw:
#     browser = pw.firefox.launch(headless=True)  # Set headless=True to run in the background
#     page = browser.new_page()
    
#     page.goto("https://unstop.com/jobs/inside-sales-executive-international-global-tenders-1404544")
    
#     # Wait for the element to load
#     page.wait_for_selector("h1")
    
#     # Extract H1 text
#     h1_text = page.locator("h1").text_content()
    
#     print("Title of the page:", page.title())
#     print("H1 text:", h1_text)
    
#     browser.close()















# <=======================Ye waala working code hai naukri ka========================>

from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
    browser = pw.firefox.launch(headless=True)  # Set headless=True to run in the background
    page = browser.new_page()
    
    page.goto("https://www.naukri.com/job-listings-quality-executive-swiggy-bengaluru-delhi-ncr-mumbai-all-areas-2-to-3-years-170225017205?src=directSearch&sid=1739850900651400&xp=3&px=1")
    
    # Wait for the element to load
    page.wait_for_selector("h1")
    
    # Extract H1 text
    h1_text = page.locator("h1").text_content()
    
    print("Title of the page:", page.title())
    print("H1 text:", h1_text)
    
    browser.close()
