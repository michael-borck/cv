#!/usr/bin/env python3
"""
Post-process Quarto HTML outputs to inject floating chat widget
"""

import sys
from pathlib import Path
from bs4 import BeautifulSoup
import shutil

def inject_chatbot(html_file):
    """Inject the floating chat widget into a Quarto-generated HTML file"""
    
    # Read the HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Check if chatbot is already injected
    if soup.find('script', {'src': lambda x: x and 'floating-chat.js' in x}):
        print(f"  ✓ Chat widget already present in {html_file}")
        return False
    
    # Find the closing body tag
    body_tag = soup.find('body')
    if not body_tag:
        print(f"  ✗ No body tag found in {html_file}")
        return False
    
    # Create the script tags for the chatbot
    chat_scripts = """
    <!-- Floating Chat Widget -->
    <script>
        // Ensure paths work from output directory
        window.chatbotBasePath = '../creative/chatbot/';
    </script>
    <script src="../creative/chatbot/assets/js/nlp.js"></script>
    <script src="../creative/chatbot/assets/js/responses.js"></script>
    <script src="../creative/chatbot/assets/js/floating-chat.js"></script>
    
    <!-- Portal Backlink -->
    <style>
        .portal-backlink {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
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
        
        /* Hide on print */
        @media print {
            .portal-backlink,
            .floating-chat-widget {
                display: none !important;
            }
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
    </style>
    """
    
    # Parse and append the scripts
    scripts_soup = BeautifulSoup(chat_scripts, 'html.parser')
    for element in reversed(scripts_soup.contents):
        if element.name:  # Skip text nodes
            body_tag.append(element)
    
    # Add portal backlink at the beginning of body
    backlink_html = """
    <a href="../index.html" class="portal-backlink" title="Return to CV Portal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        CV Portal
    </a>
    """
    backlink_soup = BeautifulSoup(backlink_html, 'html.parser')
    body_tag.insert(0, backlink_soup.a)
    
    # Write the modified HTML back
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    print(f"  ✓ Injected chat widget and backlink into {html_file}")
    return True

def main():
    """Process Quarto output HTML files"""
    
    print("Post-processing Quarto HTML outputs...")
    
    # Define the HTML files to process
    output_dir = Path('output')
    html_files = [
        output_dir / 'cv-michael-borck.html',
        # Add other Quarto-generated HTML files here if needed
    ]
    
    # Process each file
    processed = 0
    for html_file in html_files:
        if html_file.exists():
            if inject_chatbot(html_file):
                processed += 1
        else:
            print(f"  ⚠ File not found: {html_file}")
    
    if processed > 0:
        print(f"\n✅ Successfully processed {processed} file(s)")
    else:
        print("\n✓ No files needed processing")

if __name__ == "__main__":
    main()