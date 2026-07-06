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
                const antalLabel = btn.getAttribute('data-antal-label');
                const antalValue = btn.getAttribute('data-antal-value');
                const viktLabel = btn.getAttribute('data-vikt-label');
                const viktValue = btn.getAttribute('data-vikt-value');
                
                if (artnr) document.getElementById('td-artnr').textContent = artnr;
                if (antalLabel) document.getElementById('td-antal-label').textContent = antalLabel;
                if (antalValue) document.getElementById('td-antal-value').textContent = antalValue;
                if (viktLabel) document.getElementById('td-vikt-label').textContent = viktLabel;
                if (viktValue) document.getElementById('td-vikt-value').textContent = viktValue;
            });
        });
    }
});
