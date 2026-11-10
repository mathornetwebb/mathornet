document.addEventListener('DOMContentLoaded', () => {
    // Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Packaging Type Logic
    const packBtns = document.querySelectorAll('.pack-btn');
    if (packBtns.length > 0) {
        packBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                packBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const artnr = btn.getAttribute('data-artnr');
                const ean = btn.getAttribute('data-ean');
                const antalLabel = btn.getAttribute('data-antal-label');
                const antalValue = btn.getAttribute('data-antal-value');
                const viktLabel = btn.getAttribute('data-vikt-label');
                const viktValue = btn.getAttribute('data-vikt-value');
                
                const tdArtnr = document.getElementById('td-artnr');
                if (tdArtnr) tdArtnr.textContent = artnr || '';
                const tdEan = document.getElementById('td-ean');
                if (tdEan) tdEan.textContent = ean || '';
                const tdAntalLabel = document.getElementById('td-antal-label');
                if (tdAntalLabel) tdAntalLabel.textContent = antalLabel || '';
                const tdAntalValue = document.getElementById('td-antal-value');
                if (tdAntalValue) tdAntalValue.textContent = antalValue || '';
                const tdViktLabel = document.getElementById('td-vikt-label');
                if (tdViktLabel) tdViktLabel.textContent = viktLabel || '';
                const tdViktValue = document.getElementById('td-vikt-value');
                if (tdViktValue) tdViktValue.textContent = viktValue || '';
            });
        });
    }
});
