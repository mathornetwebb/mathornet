import os
import glob

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Text color #555 -> rgba(255,255,255,0.9)
    content = content.replace(
        'style="color: #555; max-width: 260px; font-size: 0.9rem; line-height: 1.6;"',
        'style="color: rgba(255,255,255,0.9); max-width: 260px; font-size: 0.9rem; line-height: 1.6;"'
    )
    # mathornet.html has margin: 0 auto; from my previous edit, let's fix it too just in case
    content = content.replace(
        'style="color: rgba(255,255,255,0.9); max-width: 260px; font-size: 0.9rem; line-height: 1.6; margin: 0 auto;"',
        'style="color: rgba(255,255,255,0.9); max-width: 260px; font-size: 0.9rem; line-height: 1.6;"'
    )
    
    # 2. Social links color #888 -> rgba(255,255,255,0.8)
    content = content.replace(
        'style="color: #888; transition: opacity 0.2s;"',
        'style="color: rgba(255,255,255,0.8); transition: opacity 0.2s;"'
    )
    
    # mathornet.html has justify-content: center; on social links from my previous edit
    content = content.replace(
        'style="display: flex; gap: 1.2rem; margin-top: 1.5rem; justify-content: center;"',
        'style="display: flex; gap: 1.2rem; margin-top: 1.5rem;"'
    )
    
    # 3. Footer legal links without pipes
    content = content.replace(
        '<a href="#">Köpvillkor</a> | <a href="#">Integritetspolicy</a> | <a href="#">Cookies</a>',
        '<a href="#">Köpvillkor</a>\n                <a href="#">Integritetspolicy</a>\n                <a href="#">Cookies</a>'
    )
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

print("Done!")
