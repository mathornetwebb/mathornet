const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.startsWith('recept-') && f.endsWith('.html'));

const newCss = `
        body { font-family: 'Inter', sans-serif; background-color: #faf9f6; margin: 0; padding: 0; }
        
        /* Hero Section */
        .post-hero { 
            position: relative; 
            height: 55vh; 
            min-height: 400px; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: flex-end;
            background: #faf9f6;
        }
        .post-hero-bg { 
            position: absolute; top: 0; left: 0; width: 100%; height: 85%;
            object-fit: cover; z-index: 0; 
        }
        
        /* Overlapping Clean Card */
        .recipe-header-card {
            position: relative;
            z-index: 2;
            background: #ffffff;
            padding: 3rem 4rem;
            border-radius: 12px;
            text-align: center;
            max-width: 900px;
            width: 90%;
            transform: translateY(15%);
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border: 1px solid #f0f0f0;
        }
        .recipe-title {
            font-family: 'Outfit', sans-serif;
            font-size: 3rem;
            font-weight: 700;
            color: #222;
            margin-bottom: 1rem;
            line-height: 1.1;
        }
        .recipe-excerpt {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        .recipe-meta-tags {
            display: flex;
            justify-content: center;
            gap: 2rem;
            font-weight: 600;
            color: #444;
            flex-wrap: wrap;
        }
        .recipe-meta-tag {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.05rem;
        }

        /* 2-Column Layout */
        .recipe-content-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 4rem;
            max-width: 1200px;
            margin: 6rem auto 6rem;
            padding: 0 2rem;
        }
        @media(min-width: 992px) {
            .recipe-content-grid {
                grid-template-columns: 380px 1fr;
            }
        }

        /* Ingredients */
        .ingredients-panel {
            background: #ffffff;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.03);
            border: 1px solid #eaeaea;
            height: fit-content;
            position: sticky;
            top: 120px;
        }
        .ingredients-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: #222;
            display: block;
            border-bottom: 2px solid #118b8b;
            padding-bottom: 0.8rem;
        }
        
        .ingredients-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .ingredients-list li {
            padding: 0.8rem 0;
            border-bottom: 1px solid #f5f5f5;
            font-size: 1.1rem;
            color: #333;
        }
        .ingredients-list li:last-child {
            border-bottom: none;
        }
        
        /* Custom Checkbox */
        .ingredient-checkbox {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            cursor: pointer;
            user-select: none;
        }
        .ingredient-checkbox input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }
        .checkmark {
            margin-top: 2px;
            height: 22px;
            width: 22px;
            background-color: #fff;
            border: 2px solid #ddd;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .ingredient-checkbox:hover input ~ .checkmark {
            border-color: #118b8b;
        }
        .ingredient-checkbox input:checked ~ .checkmark {
            background-color: #118b8b;
            border-color: #118b8b;
        }
        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            margin-bottom: 2px;
        }
        .ingredient-checkbox input:checked ~ .checkmark:after {
            display: block;
        }
        .ingredient-text {
            line-height: 1.4;
            transition: color 0.2s;
        }
        .ingredient-checkbox input:checked ~ .ingredient-text {
            color: #aaa;
            text-decoration: line-through;
        }

        /* Instructions */
        .instructions-panel {
            padding-top: 1rem;
        }
        .instructions-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 2.5rem;
            color: #222;
        }
        .instruction-step {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
        }
        .step-number {
            flex-shrink: 0;
            width: 44px;
            height: 44px;
            background: #e6f3f3;
            color: #118b8b;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
        }
        .step-text {
            font-size: 1.15rem;
            line-height: 1.7;
            color: #333;
            padding-top: 0.4rem;
        }
        
        /* Action buttons */
        .recipe-actions {
            margin-top: 4rem;
            text-align: left;
            padding-bottom: 4rem;
            border-top: 1px solid #eaeaea;
            padding-top: 2rem;
        }
        .btn-outline {
            display: inline-block;
            border: 2px solid #222;
            color: #222;
            padding: 0.8rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            font-size: 1.05rem;
        }
        .btn-outline:hover {
            background: #222;
            color: white;
        }
        
        /* Header Fix for absolute positioned hero */
        .main-header {
            position: absolute !important;
            width: 100%;
            z-index: 100;
            background: transparent !important;
        }
        .main-header.scrolled {
            position: fixed !important;
            background: #fff !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .main-header.scrolled .main-nav ul li a,
        .main-header.scrolled .search-btn,
        .main-header.scrolled .lang-toggle-btn,
        .main-header.scrolled .mobile-menu-toggle {
            color: #222 !important;
        }
        
        @media(max-width: 768px) {
            .post-hero { height: 45vh; min-height: 350px; justify-content: flex-end; }
            .post-hero-bg { height: 100%; }
            .recipe-header-card {
                padding: 1.5rem;
                transform: translateY(2rem);
                width: 90%;
                margin: 0 auto;
            }
            .recipe-title { font-size: 2rem; }
            .recipe-content-grid { margin-top: 4rem; gap: 3rem; padding: 0 1rem; }
            .ingredients-panel { position: static; padding: 1.5rem; }
            .instruction-step { flex-direction: column; gap: 0.8rem; }
        }
`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace CSS safely
    const styleRegex = /<style>[\s\S]*?<\/style>/g;
    content = content.replace(styleRegex, "<style>" + newCss + "</style>");
    
    // Remove overlay
    content = content.replace(/<div class="post-overlay"><\/div>/g, '<!-- no overlay -->');
    
    // Transform ingredients
    const ulRegex = /<ul class="ingredients-list">([\s\S]*?)<\/ul>/;
    const match = content.match(ulRegex);
    if(match) {
        let listContent = match[1];
        if(!listContent.includes('type="checkbox"')) {
            listContent = listContent.replace(/<li>(.*?)<\/li>/g, (m, innerHtml) => {
                if(innerHtml.includes('class="ingredient-checkbox"')) return m;
                return '<li>' +
                       '<label class="ingredient-checkbox">' +
                       '<input type="checkbox">' +
                       '<span class="checkmark"></span>' +
                       '<span class="ingredient-text">' + innerHtml.trim() + '</span>' +
                       '</label>' +
                       '</li>';
            });
            content = content.replace(ulRegex, '<ul class="ingredients-list">' + listContent + '</ul>');
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated " + file);
}

console.log('All recipes updated successfully!');
