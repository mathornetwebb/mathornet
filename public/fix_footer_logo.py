import os
import glob

public_dir = '.'
html_files = glob.glob(os.path.join(public_dir, '*.html'))

old_a_style = 'style="display: block; margin-top: -20px;"'
new_a_style = 'style="display: block;"'

old_img_style = 'style="height: 110px; width: auto; margin-bottom: -40px; margin-left: -15px;"'
new_img_style = 'style="height: 75px; width: auto; max-width: 100%; object-fit: contain; margin-bottom: 15px;"'

modified_count = 0

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    updated = False
    
    if old_a_style in content:
        content = content.replace(old_a_style, new_a_style)
        updated = True
        
    if old_img_style in content:
        content = content.replace(old_img_style, new_img_style)
        updated = True
        
    if updated:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        modified_count += 1
        print(f"Updated footer styles in {os.path.basename(file_path)}")

print(f"Successfully updated styles in {modified_count} files.")
