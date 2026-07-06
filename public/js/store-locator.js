document.addEventListener('DOMContentLoaded', () => {
    // 1. Mock Data for Stores
    const stores = [
        {
            id: 1,
            name: "Coop Högsbo",
            address: "Marklandsgatan 59, 414 77 Göteborg",
            lat: 57.6749,
            lng: 11.9255,
            statusText: "Öppet till 21:00",
            statusClass: "open",
            phone: "+46 10 746 33 10",
            website: "coop.se"
        },
        {
            id: 2,
            name: "Orient Food",
            address: "Norra Grängesbergsgatan 5, 214 44 Malmö",
            lat: 55.5866,
            lng: 13.0233,
            statusText: "Stänger om 1h",
            statusClass: "closing",
            phone: "+46 40 92 77 78",
            website: "orient-food.se"
        },
        {
            id: 3,
            name: "Maxi ICA Stormarknad Ängelholm",
            address: "Hugingatan 1, 262 71 Ängelholm",
            lat: 56.2435,
            lng: 12.8687,
            statusText: "Öppet till 23:00",
            statusClass: "open",
            phone: "+46 431 44 34 00",
            website: "ica.se"
        },
        {
            id: 4,
            name: "ICA Supermarket Bellevuegården",
            address: "Svansjögatan 3, 217 66 Malmö",
            lat: 55.5815,
            lng: 12.9839,
            statusText: "Öppet till 23:00",
            statusClass: "open",
            phone: "+46 40 13 00 10",
            website: "ica.se"
        },
        {
            id: 5,
            name: "Lucu Food",
            address: "Agnesfridsvägen 178, 213 75 Malmö",
            lat: 55.5702,
            lng: 13.0456,
            statusText: "Öppet till 20:00",
            statusClass: "open",
            phone: "+46 40 680 20 20",
            website: "lucufood.se"
        },
        {
            id: 6,
            name: "Matdax Hökarängen",
            address: "Örbyleden 10, 123 52 Farsta",
            lat: 59.2562,
            lng: 18.0833,
            statusText: "Stängt",
            statusClass: "closed",
            phone: "+46 8 604 10 20",
            website: "matdax.se"
        },
        {
            id: 7,
            name: "Willys Stockholm Älvsjö",
            address: "Älvsjövägen 110, 125 33 Älvsjö",
            lat: 59.2789,
            lng: 18.0069,
            statusText: "Öppet till 22:00",
            statusClass: "open",
            phone: "+46 8 506 630 00",
            website: "willys.se"
        }
    ];

    // 2. Initialize Leaflet Map
    // Default center to a view showing south/middle Sweden
    const map = L.map('locator-map', {
        zoomControl: false // We can add it in a custom position if we want
    }).setView([58.0, 14.5], 6);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add CartoDB Positron tile layer (clean, light map very similar to the screenshot)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // 3. Custom Icon for Mathörnet
    const mathornetIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<img src="img/mathörnet logo.png" style="width: 20px; filter: brightness(0) invert(1);" alt="Icon">`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
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
