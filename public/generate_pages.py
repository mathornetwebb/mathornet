import os
import glob
import re

# 1. Read base structure from mathornet.html
with open("mathornet.html", "r", encoding="utf-8") as f:
    mathornet_content = f.read()

header = mathornet_content[:mathornet_content.find("<main>")]
footer = mathornet_content[mathornet_content.find("</main>"):]

# 2. Define page contents
pages = {
    "integritetspolicy.html": {
        "title": "Integritetspolicy",
        "content": """
    <main style="padding: 120px 20px; background-color: #fcf9f4; min-height: 60vh;">
        <div class="container" style="max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: var(--theme-green); font-size: 2.5rem; margin-bottom: 20px;">Integritetspolicy</h1>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Din personliga integritet är viktig för oss på Mathörnet. I denna integritetspolicy förklarar vi hur vi samlar in, använder och skyddar dina personuppgifter när du besöker vår webbplats eller kontaktar oss, i enlighet med dataskyddsförordningen (GDPR).</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">1. Vilka uppgifter vi samlar in</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Vi samlar endast in uppgifter som du frivilligt delar med oss, till exempel när du fyller i kontaktformuläret (namn, e-post, telefonnummer och meddelande) eller ansöker om att bli återförsäljare.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">2. Hur vi använder uppgifterna</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Dina uppgifter används uteslutande för att:</p>
            <ul style="margin-bottom: 15px; line-height: 1.6; color: #444; padding-left: 20px;">
                <li>Svara på dina förfrågningar och meddelanden.</li>
                <li>Hantera återförsäljaransökningar.</li>
                <li>Förbättra vår service och hemsida.</li>
            </ul>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">3. Hur vi skyddar dina uppgifter</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Vi vidtar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda dina personuppgifter mot obehörig åtkomst, ändring eller radering. Vi säljer aldrig dina uppgifter till tredje part.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">4. Dina rättigheter</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Du har rätt att begära utdrag, rättelse eller radering av dina personuppgifter. Om du vill utöva dessa rättigheter, vänligen kontakta oss på info@mathornet.se.</p>
        </div>
    </main>
"""
    },
    "kopvillkor.html": {
        "title": "Köpvillkor",
        "content": """
    <main style="padding: 120px 20px; background-color: #fcf9f4; min-height: 60vh;">
        <div class="container" style="max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: var(--theme-green); font-size: 2.5rem; margin-bottom: 20px;">Köpvillkor</h1>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Dessa allmänna villkor gäller för beställningar av produkter från Mathörnet AB, med säte i Strängnäs, både för privatkunder (i mån av direktförsäljning) och B2B-återförsäljare, om inget annat specifikt avtalats.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">1. Beställning och Avtal</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Avtal om köp ingås när Mathörnet bekräftar din beställning via e-post eller annat skriftligt avtal. För återförsäljare gäller specifika volym- och leveransavtal.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">2. Priser och Betalning</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Alla priser på hemsidan eller i offerter anges inklusive eller exklusive moms beroende på kundtyp. Mathörnet reserverar sig för eventuella prisändringar och tryckfel. Betalningsvillkor för företagskunder är normalt 30 dagar netto, såvida inget annat avtalats.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">3. Leveransvillkor</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Vi strävar efter att leverera våra produkter så snabbt och säkert som möjligt för att säkerställa högsta matkvalitet. Leveranstider och fraktkostnader framgår vid beställning eller enligt specifikt företagsavtal.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">4. Reklamation och Returer</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Eftersom våra produkter är livsmedel gäller särskilda regler för retur. Kontakta vår kundtjänst omedelbart på info@mathornet.se vid defekt vara eller felaktig leverans. Vid godkänd reklamation ersätter vi produkten eller återbetalar beloppet.</p>
        </div>
    </main>
"""
    },
    "cookies.html": {
        "title": "Cookies",
        "content": """
    <main style="padding: 120px 20px; background-color: #fcf9f4; min-height: 60vh;">
        <div class="container" style="max-width: 800px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
            <h1 style="color: var(--theme-green); font-size: 2.5rem; margin-bottom: 20px;">Om Cookies</h1>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Mathörnet använder cookies (kakor) för att förbättra din upplevelse på vår webbplats, analysera trafik och förstå hur våra besökare interagerar med innehållet.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">Vad är en cookie?</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">En cookie är en liten textfil som sparas på din dator, surfplatta eller mobiltelefon när du besöker en webbplats. De används i stor utsträckning för att få webbplatser att fungera mer effektivt samt för att ge information till webbplatsens ägare.</p>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">Hur vi använder cookies</h2>
            <ul style="margin-bottom: 15px; line-height: 1.6; color: #444; padding-left: 20px;">
                <li><strong>Nödvändiga cookies:</strong> Dessa behövs för att webbplatsen ska fungera (t.ex. säkerhet och nätverkshantering).</li>
                <li><strong>Analys-cookies:</strong> Hjälper oss förstå hur besökare använder hemsidan (t.ex. Google Analytics), så att vi kan förbättra struktur och innehåll. Data som samlas in är anonymiserad.</li>
            </ul>
            
            <h2 style="color: #222; font-size: 1.5rem; margin: 30px 0 15px;">Hantera dina cookies</h2>
            <p style="margin-bottom: 15px; line-height: 1.6; color: #444;">Du kan när som helst ändra inställningarna i din webbläsare för att blockera cookies eller bli varnad när en fil sparas. Tänk på att vissa funktioner på webbplatsen kanske inte fungerar optimalt om du inaktiverar cookies.</p>
        </div>
    </main>
"""
    }
}

# Generate files
for filename, data in pages.items():
    # update title in header
    page_header = re.sub(r"<title>.*?</title>", f"<title>{data['title']} | Mathörnet</title>", header)
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(page_header + data["content"] + footer)
    print(f"Created {filename}")

# 3. Update footer links in ALL HTML files
html_files = glob.glob("*.html")
for filename in html_files:
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace standard footer links
    content = content.replace('<a href="#">Köpvillkor</a>', '<a href="kopvillkor.html">Köpvillkor</a>')
    content = content.replace('<a href="#">Integritetspolicy</a>', '<a href="integritetspolicy.html">Integritetspolicy</a>')
    content = content.replace('<a href="#">Cookies</a>', '<a href="cookies.html">Cookies</a>')
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated links in all HTML files.")
