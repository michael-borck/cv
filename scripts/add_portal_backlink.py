#!/usr/bin/env python3
"""
Add portal backlink to all creative CV formats
"""

from pathlib import Path
from bs4 import BeautifulSoup

def add_backlink_styles():
    """Return the CSS styles for the portal backlink"""
    return """
    <style>
        .portal-backlink {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .portal-backlink:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
            text-decoration: none;
            color: white;
        }
        
        .portal-backlink svg {
            width: 16px;
            height: 16px;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .portal-backlink {
                padding: 8px 16px;
                font-size: 12px;
                top: 10px;
                left: 10px;
            }
        }
        
        /* Ensure it's above other elements */
        .floating-chat-widget {
            z-index: 9999;
        }
    </style>
    """

def add_backlink_html():
    """Return the HTML for the portal backlink"""
    return """
    <a href="../../index.html" class="portal-backlink" title="Return to CV Portal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        CV Portal
    </a>
    """

def add_backlink_to_file(html_file):
    """Add portal backlink to an HTML file"""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Check if backlink already exists
    if soup.find('a', {'class': 'portal-backlink'}):
        print(f"  ✓ Backlink already present in {html_file}")
        return False
    
    # Add styles to head
    head_tag = soup.find('head')
    if head_tag:
        styles_soup = BeautifulSoup(add_backlink_styles(), 'html.parser')
        head_tag.append(styles_soup.style)
    
    # Add backlink to body
    body_tag = soup.find('body')
    if body_tag:
        backlink_soup = BeautifulSoup(add_backlink_html(), 'html.parser')
        body_tag.insert(0, backlink_soup.a)
    else:
        print(f"  ✗ No body tag found in {html_file}")
        return False
    
    # Write the modified HTML back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    print(f"  ✓ Added portal backlink to {html_file}")
    return True

def main():
    """Add backlinks to all creative CV formats"""
    
    print("Adding portal backlinks to creative CV formats...")
    
    # Define the HTML files to process
    creative_dir = Path('creative')
    html_files = [
        creative_dir / 'api' / 'index.html',
        creative_dir / 'magazine' / 'index.html',
        creative_dir / 'quest' / 'index.html',
        creative_dir / 'terminal' / 'index.html',
    ]
    
    # Process each file
    processed = 0
    for html_file in html_files:
        if html_file.exists():
            if add_backlink_to_file(html_file):
                processed += 1
        else:
            print(f"  ⚠ File not found: {html_file}")
    
    if processed > 0:
        print(f"\n✅ Successfully added backlinks to {processed} file(s)")
    else:
        print("\n✓ No files needed processing")

if __name__ == "__main__":
    main()