function changeLanguage(lang) {
    if (lang === 'sv') {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
        document.cookie = "googtrans=/sv/" + lang + "; path=/; domain=" + window.location.hostname;
        document.cookie = "googtrans=/sv/" + lang + "; path=/;";
    }
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    let match = document.cookie.match(/googtrans=\/sv\/([a-z]{2})/);
    let lang = match ? match[1] : 'sv';
    
    // Hantera custom dropdown logic
    const toggleBtn = document.querySelector('.lang-toggle-btn');
    const dropdown = document.querySelector('.lang-dropdown');
    
    if (toggleBtn && dropdown) {
        // Toggle menu on click
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });

        // Handle language selection
        const options = document.querySelectorAll('.lang-option');
        options.forEach(option => {
            // Markera aktivt språk
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active-lang');
            }

            option.addEventListener('click', () => {
                const selectedLang = option.getAttribute('data-lang');
                changeLanguage(selectedLang);
            });
        });
    }
    
    // Sätt RTL/LTR
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', lang);
    }
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'sv', autoDisplay: false}, 'google_translate_element');
}
