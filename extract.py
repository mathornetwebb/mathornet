import re
import json
import os

files = [
    "sandwich-kubbe.html",
    "kubbe-trabolsie.html",
    "kubbe-halab.html",
    "potatis-kubbe.html",
    "ris-kubbe.html",
    "kubbe-mosel.html"
]

products = []

for file in files:
    filepath = os.path.join("public", file)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
        
    # Extract Title
    title_match = re.search(r'<h1 class="desktop-only">([^<]+)</h1>', html)
    title = title_match.group(1).strip() if title_match else "Unknown"
    
    # Extract Slug
    slug = file.replace(".html", "")
    
    # Extract Featured Image
    img_match = re.search(r'<div class="product-detail-img"[^>]*>.*?<img src="([^"]+)"', html, re.DOTALL)
    featuredImage = img_match.group(1) if img_match else "img/placeholder.png"
    
    # Extract Packaging
    pack_regex = r'<button class="pack-btn.*?data-type="([^"]+)".*?data-artnr="([^"]*)".*?data-antal-value="([^"]*)".*?data-vikt-value="([^"]*)"'
    packs = re.findall(pack_regex, html, re.DOTALL)
    
    packaging = {"bag": {}, "box": {}, "pallet": {}}
    for ptype, artnr, count, weight in packs:
        if ptype in packaging:
            packaging[ptype] = {"count": count, "weight": weight}
            if ptype == "bag":
                bag_artnr = artnr
    
    # Extract EAN
    ean_match = re.search(r'<td>EAN13:</td>\s*<td>([^<]*)</td>', html)
    ean = ean_match.group(1).strip() if ean_match else ""
    
    # Extract Description
    desc_match = re.search(r'Beskrivning.*?</button>\s*<div class="accordion-content">\s*<div class="accordion-content-inner">(.*?)</div>\s*</div>', html, re.DOTALL)
    description = desc_match.group(1).strip() if desc_match else ""
    
    # Extract Product Info
    pinfo_match = re.search(r'Produktinformation.*?</button>\s*<div class="accordion-content">\s*<div class="accordion-content-inner">(.*?)</div>\s*</div>', html, re.DOTALL)
    pinfo = pinfo_match.group(1).strip() if pinfo_match else ""
    
    # Extract properties, manufacturer, etc from pinfo
    manufacturer = "Mathörnet"
    manufacturingCountry = "Sverige"
    specialDiets = "N/A"
    leadTime = "5 dagar"
    properties = []
    
    for line in pinfo.split('\n'):
        line = line.strip()
        if not line or '<strong>' in line:
            continue
        # Extract plain text properties
        prop_text = re.sub(r'<[^>]+>', '', line).strip()
        if prop_text:
            properties.append(prop_text)
            
    # Extract Nutrition (Näringsvärde)
    nut_match = re.search(r'Näringsvärde.*?</button>\s*<div class="accordion-content">\s*<div class="accordion-content-inner">\s*<table class="nutrition-table">\s*<tbody>(.*?)</tbody>', html, re.DOTALL)
    nutrition = ""
    if nut_match:
        nutrition = f'<table class="nutrition-table"><tbody>{nut_match.group(1)}</tbody></table>'
        
    # Extract Ingredients
    ing_match = re.search(r'Innehållsförteckning.*?</button>\s*<div class="accordion-content">\s*<div class="accordion-content-inner">(.*?)</div>\s*</div>', html, re.DOTALL)
    ingredients = ing_match.group(1).strip() if ing_match else ""
    
    # Extract Storage
    store_match = re.search(r'Förvaring.*?</button>\s*<div class="accordion-content">\s*<div class="accordion-content-inner">(.*?)</div>\s*</div>', html, re.DOTALL)
    storage = store_match.group(1).strip() if store_match else ""
    
    # Extract Cooking
    cook_match = re.search(r'Tillagningsanvisningar.*?</button>\s*<div class="accordion-content">\s*<div class="accordion-content-inner">(.*?)</div>\s*</div>', html, re.DOTALL)
    cookingInstructions = cook_match.group(1).strip() if cook_match else ""

    productInfo = {
        "manufacturer": manufacturer,
        "manufacturingCountry": manufacturingCountry,
        "properties": properties,
        "specialDiets": specialDiets,
        "leadTime": leadTime,
        "packaging": packaging
    }

    products.append({
        "slug": slug,
        "title": title,
        "artNr": bag_artnr,
        "ean": ean,
        "countPerBag": packaging["bag"].get("count", ""),
        "weightPerBag": packaging["bag"].get("weight", ""),
        "description": description,
        "productInfo": json.dumps(productInfo),
        "nutritionInfo": nutrition,
        "ingredients": ingredients,
        "storage": storage,
        "cookingInstructions": cookingInstructions,
        "featuredImage": featuredImage,
        "published": True
    })

with open("products_data.json", "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(products)} products!")
