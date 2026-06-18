document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Real data for search suggestions
    const db = [
        { title: 'Kubbe Trabolsie', category: 'Produkt', text: 'Vår bästsäljande friterade bulgur- och köttkrokett.', url: 'index.html' },
        { title: 'Kubbe Halab', category: 'Produkt', text: 'Krispig riskrokett fylld med köttfärs, mandel och lök.', url: 'index.html' },
        { title: 'Sandwich Kubbe', category: 'Produkt', text: 'Två lager krispig bulgur fyllda med välkryddad köttfärs.', url: 'index.html' },
        { title: 'Falafel', category: 'Produkt', text: 'Autentiska kikärtsbollar kryddade med persilja och koriander.', url: 'index.html' },
        { title: 'Äkta Libanesisk Toum', category: 'Recept', text: 'Den perfekta fluffiga vitlökskrämen som är ett absolut måste till kyckling.', url: 'recept-libanesisk-toum.html' },
        { title: 'Krämig Hummus', category: 'Recept', text: 'Silkeslen hummus med tahini och citron. Det självklara tillbehöret.', url: 'recept-kramig-hummus.html' },
        { title: 'Krispig Fattoush', category: 'Recept', text: 'Mellanösterns godaste sallad! Fylld med färska grönsaker och sumak.', url: 'recept-krispig-fattoush.html' },
        { title: 'Årets Leverantör', category: 'Nyhet', text: 'Mathörnet nominerade till Årets Leverantör 2026 i livsmedelsbranschen.', url: 'nyheter-arets-leverantor-2026.html' },
        { title: '100% grön energi', category: 'Nyhet', text: 'Vårt nya hållbarhetslöfte: 100% grön energi.', url: 'nyheter-hallbar-framtid.html' }
    ];

    // Toggle dropdown
    searchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchDropdown.classList.toggle('active');
        if (searchDropdown.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchDropdown.contains(e.target) && !searchBtn.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }
    });

    // Prevent closing when clicking inside
    searchDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';

        if (query.length > 0) {
            const matches = db.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.text.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                matches.forEach(match => {
                    const el = document.createElement('div');
                    el.className = 'search-result-item';
                    el.innerHTML = `
                        <a href="${match.url || '#'}" style="text-decoration: none; color: inherit; display: block;">
                            <h4>${match.title}</h4>
                            <p>${match.category} - ${match.text.substring(0, 40)}...</p>
                        </a>
                    `;
                    searchResults.appendChild(el);
                });
            } else {
                searchResults.innerHTML = '<div class="search-result-item"><p>Inga resultat hittades för "' + query + '"</p></div>';
            }
        }
    });

    // Accordion Logic for Product Pages
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            
            // Toggle active class
            item.classList.toggle('active');
            
            // Animate max-height
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0px";
            }
        });
    });
});


/* ==========================================================================
   Product Carousel Logic (Multi-support)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.carousel-wrapper');
    
    wrappers.forEach(carouselWrapper => {
        const track = carouselWrapper.querySelector('.carousel-track');
        const prevBtn = carouselWrapper.parentElement.querySelector('.prev-btn') || carouselWrapper.querySelector('.prev-btn');
        const nextBtn = carouselWrapper.parentElement.querySelector('.next-btn') || carouselWrapper.querySelector('.next-btn');
        const dotsContainer = carouselWrapper.parentElement.querySelector('.carousel-dots') || carouselWrapper.querySelector('.carousel-dots');
        
        if (!track) return;

        let currentIndex = 0;
        let itemsPerView = 3;
        
        const items = track.querySelectorAll('.carousel-card');
        let maxIndex = 0;
        let currentDots = [];
        let autoSlideInterval;

        function updateConfig() {
            if (window.innerWidth <= 768) itemsPerView = 1;
            else if (window.innerWidth <= 992) itemsPerView = 2;
            else itemsPerView = 3;
            
            maxIndex = Math.max(0, items.length - itemsPerView);
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i <= maxIndex; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
                    dot.setAttribute('data-index', i);
                    dot.setAttribute('aria-label', 'Sida ' + (i + 1));
                    
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateCarousel();
                        resetAutoSlide();
                    });
                    
                    dotsContainer.appendChild(dot);
                }
                currentDots = dotsContainer.querySelectorAll('.dot');
            }
        }

        function updateCarousel() {
            if (!items.length) return;
            const itemWidth = items[0].getBoundingClientRect().width;
            const gap = 32; // 2rem
            const moveAmount = currentIndex * (itemWidth + gap);
            
            track.style.transform = `translateX(-${moveAmount}px)`;
            
            if (currentDots.length) {
                currentDots.forEach((dot, index) => {
                    if (index === currentIndex) dot.classList.add('active');
                    else dot.classList.remove('active');
                });
            }
        }

        function slideNext() {
            currentIndex++;
            if (currentIndex > maxIndex) currentIndex = 0;
            updateCarousel();
        }

        function slidePrev() {
            currentIndex--;
            if (currentIndex < 0) currentIndex = maxIndex;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', () => {
            slideNext();
            resetAutoSlide();
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            slidePrev();
            resetAutoSlide();
        });

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(slideNext, 4000);
        }

        carouselWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselWrapper.addEventListener('mouseleave', resetAutoSlide);

        window.addEventListener('resize', () => {
            updateConfig();
            updateCarousel();
        });
        
        updateConfig();
        setTimeout(updateCarousel, 100);
        resetAutoSlide();
    });
});

// Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('page-preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// Footer Reveal Logic
function initFooterReveal() {
    const footer = document.querySelector('.site-footer');
    const main = document.querySelector('main');
    if (!footer || !main) return;
    
    let spacer = document.querySelector('.footer-spacer');
    if (!spacer) {
        spacer = document.createElement('div');
        spacer.className = 'footer-spacer';
        // Lägg in spacern direkt efter main (och före footern)
        main.parentNode.insertBefore(spacer, footer);
    }
    
    function updateFooterReveal() {
        const footerHeight = footer.offsetHeight;
        spacer.style.height = footerHeight + 'px';
    }
    
    window.addEventListener('resize', updateFooterReveal);
    updateFooterReveal();
    
    // Säkerställ att höjden är rätt även efter att bilder/typsnitt laddats
    setTimeout(updateFooterReveal, 100);
    setTimeout(updateFooterReveal, 500);
    setTimeout(updateFooterReveal, 1500);
}

document.addEventListener('DOMContentLoaded', initFooterReveal);

// Hamburger Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            if (mainNav.classList.contains('active')) {
                body.style.overflow = 'hidden'; // Prevent background scrolling
            } else {
                body.style.overflow = '';
            }
        });
    }
});


