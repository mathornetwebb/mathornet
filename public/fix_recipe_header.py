import glob

css_to_add = """
        /* Fix for header icons visibility over dark image */
        .post-hero::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 150px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
            z-index: 1;
            pointer-events: none;
        }
        .main-header:not(.scrolled) .main-logo {
            filter: brightness(0) invert(1);
        }
        .main-header:not(.scrolled) .main-nav ul li a,
        .main-header:not(.scrolled) .search-btn,
        .main-header:not(.scrolled) .lang-toggle-btn,
        .main-header:not(.scrolled) .mobile-menu-toggle {
            color: #fff !important;
        }
        
        /* Prevent horizontal scroll */
        body {
            overflow-x: hidden !important;
            width: 100%;
            position: relative;
        }
"""

for f in glob.glob("recept-*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    if "/* Header Fix for absolute positioned hero */" in content:
        # Check if already added to avoid duplicates
        if "filter: brightness(0) invert(1);" not in content:
            # We insert it right before closing style tag
            new_content = content.replace("</style>", css_to_add + "\n</style>")
            with open(f, "w") as file:
                file.write(new_content)
            print(f"Updated {f}")
        else:
            print(f"Already updated {f}")

print("Done!")
