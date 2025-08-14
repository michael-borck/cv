#!/usr/bin/env python3
"""
Convert HTML CV to PDF using Playwright
Install: pip install playwright && playwright install chromium
"""

import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def html_to_pdf():
    html_file = Path("output/cv-michael-borck.html").resolve()
    pdf_file = Path("output/cv-michael-borck.pdf")
    
    if not html_file.exists():
        print(f"Error: {html_file} not found. Run 'make html' first.")
        sys.exit(1)
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Load the HTML file
        page.goto(f"file://{html_file}")
        
        # Generate PDF with print CSS media
        page.pdf(
            path=str(pdf_file),
            format="A4",
            print_background=True,
            margin={
                "top": "15mm",
                "right": "15mm", 
                "bottom": "15mm",
                "left": "15mm"
            }
        )
        
        browser.close()
    
    print(f"PDF generated: {pdf_file}")

if __name__ == "__main__":
    html_to_pdf()