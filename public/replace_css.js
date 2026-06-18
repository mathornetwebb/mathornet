const fs = require('fs');

let css = fs.readFileSync('public/style.css', 'utf8');
const startIdx = css.indexOf('/* === MOBILE FIXES === */');

if(startIdx !== -1) {
    css = css.substring(0, startIdx);
    
    const newCss = `/* === MOBILE FIXES === */
@media (max-width: 768px) {
    /* GLOBAL RESETS FOR HORIZONTAL SCROLL */
    html, body {
        overflow-x: hidden !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    .container {
        padding: 0 1rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* HEADER & NAVIGATION */
    .header-inner {
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 0.5rem 1rem !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    .main-logo {
        height: 40px !important;
        max-width: 120px !important;
        object-fit: contain !important;
        margin: 0 !important;
    }
    .header-actions {
        display: flex !important;
        gap: 0.5rem !important;
        align-items: center !important;
        flex-shrink: 0 !important;
    }
    
    .mobile-menu-toggle {
        display: block !important;
        margin-left: 0.5rem !important;
        flex-shrink: 0 !important;
        order: 1 !important;
    }
    
    .main-nav {
        position: fixed !important;
        top: 0 !important;
        right: -100% !important;
        width: 85vw !important;
        max-width: 320px !important;
        height: 100vh !important;
        background-color: #fff !important;
        box-shadow: -5px 0 30px rgba(0,0,0,0.1) !important;
        z-index: 9999 !important;
        transition: right 0.3s ease-in-out !important;
        display: flex !important;
        flex-direction: column !important;
        padding: 80px 2rem 2rem !important;
        overflow-y: auto !important;
        box-sizing: border-box !important;
    }
    
    .main-nav.active {
        right: 0 !important;
    }
    
    .main-nav ul {
        flex-direction: column !important;
        gap: 1rem !important;
        align-items: flex-start !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    .main-nav ul li {
        width: 100% !important;
    }
    
    .main-nav ul li a {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        display: block !important;
        width: 100% !important;
        padding: 0.8rem 0 !important;
        border-bottom: 1px solid #eee !important;
        color: #1a2a40 !important;
    }
    
    /* TYPOGRAPHY */
    .hero-content h1 {
        font-size: 1.8rem !important;
        line-height: 1.2 !important;
        margin-bottom: 1rem !important;
        word-wrap: break-word !important;
        hyphens: auto !important;
    }
    .hero-content p {
        font-size: 1rem !important;
        word-wrap: break-word !important;
    }
    h2, .section-header h2, .about-hero h1, .contact-wrapper h2, .vision-cards-section h2.section-title, .cta-section h2, .cta-bottom-card h2 {
        font-size: 1.6rem !important;
        word-wrap: break-word !important;
    }
    h3 {
        font-size: 1.3rem !important;
        word-wrap: break-word !important;
    }
    
    /* LAYOUT & SPACING */
    .hero-section {
        padding-top: 100px !important;
        min-height: auto !important;
        padding-bottom: 50px !important;
        box-sizing: border-box !important;
    }
    
    .products-section, .retailers-section, .news-section, .retailers-gallery, .cta-bottom-section, .about-hero, .zigzag-section, .contact-form-section, .vision-cards-section, .cta-section {
        padding-top: 40px !important;
        padding-bottom: 40px !important;
        box-sizing: border-box !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    
    .zigzag-row, .zigzag-row.reverse {
        flex-direction: column !important;
        gap: 1.5rem !important;
        margin-bottom: 3rem !important;
        padding: 0 !important;
    }
    .zigzag-content {
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 0 !important;
    }
    .zigzag-logo {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        box-sizing: border-box !important;
    }
    
    /* GRIDS */
    .products-grid, .retailers-grid, .vision-cards-grid, .footer-grid, .news-grid {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
        width: 100% !important;
    }
    
    .retailers-gallery div[style*="display: flex"] {
        flex-direction: row !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        gap: 1rem !important;
        padding: 0 !important;
    }
    .retailers-gallery img {
        height: 35px !important;
        max-width: 45% !important;
        object-fit: contain !important;
    }
    
    .footer-col {
        margin-bottom: 2rem !important;
        width: 100% !important;
    }
    
    /* Specific Page Fixes */
    .vision-card { 
        box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important; 
        margin-bottom: 1.5rem !important; 
        width: 100% !important;
        box-sizing: border-box !important;
    }
    .contact-wrapper { 
        padding: 1.5rem 1rem !important; 
        width: 100% !important; 
        border-radius: 0 !important; 
        box-sizing: border-box !important;
    }
    .about-contact-form input, .about-contact-form textarea { 
        font-size: 16px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
}
`;
    
    fs.writeFileSync('public/style.css', css + newCss);
    console.log('Successfully replaced mobile fixes block in style.css');
} else {
    console.log('Error: Could not find MOBILE FIXES block.');
}
