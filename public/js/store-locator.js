document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Data for Stores
    const stores = [
        
    ];

    // 2. Initialize Leaflet Map
    // Default center to a view showing south/middle Sweden
    const map = L.map('locator-map', {
        zoomControl: false // We can add it in a custom position if we want
    }).setView([58.0, 14.5], 6);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add Google Maps tile layer (bypasses Leaflet attribution flag and gives Google Maps styling)
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Maps',
        maxZoom: 20
    }).addTo(map);

    // Remove the default Leaflet attribution prefix (which contains the Ukrainian flag)
    map.attributionControl.setPrefix(false);

    // 3. Custom Icon for Mathörnet
    const mathornetIcon = L.divIcon({
        className: '',
        html: `<div style="background-color: white; border-radius: 12px; padding: 4px 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: inline-flex; align-items: center; justify-content: center;">
                   <img src="img/mathörnet logo.png" style="width: 65px; height: auto; display: block;" alt="Mathörnet">
               </div>`,
        iconSize: [81, 32],
        iconAnchor: [40, 16],
        popupAnchor: [0, -16]
    });

    // 4. Store Markers and List Logic
    const storeListEl = document.getElementById('store-list');
    const storeCountEl = document.getElementById('store-count-text');
    const searchInput = document.getElementById('store-search-input');
    
    let markers = []; // Store reference to markers

    function renderStores(storesToRender) {
        // Update count
        storeCountEl.textContent = `${storesToRender.length} platser`;

        // Clear list and map markers
        storeListEl.innerHTML = '';
        markers.forEach(m => map.removeLayer(m.marker));
        markers = [];

        // If no stores, return
        if (storesToRender.length === 0) {
            storeListEl.innerHTML = '<li style="padding: 2rem; color: #888;">Inga butiker hittades.</li>';
            return;
        }

        // Feature group to calculate bounds of all visible markers
        const bounds = L.featureGroup();

        storesToRender.forEach(store => {
            // Render List Item
            const li = document.createElement('li');
            li.className = 'store-card';
            li.dataset.id = store.id;
            
            li.innerHTML = `
                <div class="store-name">${store.name}</div>
                <div class="store-status ${store.statusClass}">${store.statusText}</div>
                <div class="store-address">
                    ${store.address}<br>
                    ${store.phone}<br>
                    ${store.website}
                </div>
            `;

            storeListEl.appendChild(li);

            // Create Map Marker
            const marker = L.marker([store.lat, store.lng], { icon: mathornetIcon }).addTo(map);
            
            // Popup content
            marker.bindPopup(`
                <strong>${store.name}</strong><br>
                ${store.address}
            `);

            bounds.addLayer(marker);

            markers.push({
                id: store.id,
                marker: marker,
                element: li
            });

            // Click events
            li.addEventListener('click', () => {
                activateStore(store.id);
            });

            marker.on('click', () => {
                activateStore(store.id);
                // Scroll list to item
                li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });

        // Fit map bounds to show all markers if there are any
        if (storesToRender.length > 0) {
            map.fitBounds(bounds.getBounds(), { padding: [50, 50], maxZoom: 14 });
        }
    }

    function activateStore(id) {
        markers.forEach(m => {
            if (m.id === id) {
                m.element.classList.add('active');
                m.marker.openPopup();
                map.flyTo(m.marker.getLatLng(), 15, {
                    duration: 1.5
                });
            } else {
                m.element.classList.remove('active');
            }
        });
    }

    // 5. Search Logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if (term === '') {
            renderStores(stores);
            return;
        }

        const filtered = stores.filter(store => {
            return store.name.toLowerCase().includes(term) ||
                   store.address.toLowerCase().includes(term);
        });

        renderStores(filtered);
    });

    // Initial render
    renderStores(stores);
    
    // Fix map rendering issues on some devices when inside flex containers
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
});
