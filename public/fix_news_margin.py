import glob

for f in glob.glob("nyhet-*.html"):
    with open(f, "r") as file:
        content = file.read()
    
    # Replace margin-bottom with padding-bottom to prevent margin collapsing outside <main>
    if "margin: 4rem auto 6rem; padding: 0 2rem;" in content:
        new_content = content.replace(
            "margin: 4rem auto 6rem; padding: 0 2rem;", 
            "margin: 4rem auto 0; padding: 0 2rem 6rem;"
        )
        with open(f, "w") as file:
            file.write(new_content)
        print(f"Updated {f}")
    else:
        print(f"No match in {f}")

print("Done!")
