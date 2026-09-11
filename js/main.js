// Mobile nav toggle - with error handling
try {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Close nav on link click
        var links = document.querySelectorAll('.nav-links a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        }
    }

    // Smooth scroll for anchor links
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
} catch (error) {
    console.log('Nav init error:', error);
}

// Weather Widget - Open-Meteo API (free, no key required)
function loadWeather() {
    var widget = document.getElementById('weatherWidget');
    if (!widget) return;

    var lat = 14.6819;
    var lon = 77.6006;

    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=Asia/Kolkata')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var current = data.current;
            var daily = data.daily;

            var weatherCodes = {
                0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
                45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
                55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
                71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
                80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
                85: 'Slight snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
                96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
            };

            var weatherDesc = weatherCodes[current.weather_code] || 'Unknown';
            var uvIndex = current.uv_index || 0;
            var uvAdvisory = 'Low';
            var uvColor = '#22c55e';
            
            if (uvIndex > 10) { uvAdvisory = 'Extreme'; uvColor = '#a855f7'; }
            else if (uvIndex > 7) { uvAdvisory = 'Very High'; uvColor = '#ef4444'; }
            else if (uvIndex > 5) { uvAdvisory = 'High'; uvColor = '#f97316'; }
            else if (uvIndex > 2) { uvAdvisory = 'Moderate'; uvColor = '#eab308'; }

            var sunrise = daily.sunrise[0] ? new Date(daily.sunrise[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
            var sunset = daily.sunset[0] ? new Date(daily.sunset[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
            var maxTemp = Math.round(daily.temperature_2m_max[0]);
            var heatAdvisory = '';
            
            if (maxTemp >= 42) heatAdvisory = 'Extreme Heat Alert! Avoid outdoor activities.';
            else if (maxTemp >= 38) heatAdvisory = 'Very Hot. Stay hydrated.';
            else if (maxTemp >= 35) heatAdvisory = 'Hot. Drink water regularly.';

            widget.innerHTML = '<div class="weather-content">' +
                '<div class="weather-main">' +
                '<div class="weather-temp">' + Math.round(current.temperature_2m) + '°C</div>' +
                '<div>' +
                '<div class="weather-desc">' + weatherDesc + '</div>' +
                '<div style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.25rem;">Feels like ' + Math.round(current.apparent_temperature) + '°C</div>' +
                (heatAdvisory ? '<div style="font-size: 0.85rem; margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.15); border-radius: 6px;">' + heatAdvisory + '</div>' : '') +
                '</div></div>' +
                '<div class="weather-details">' +
                '<div class="weather-detail"><div class="weather-detail-value">' + current.relative_humidity_2m + '%</div><div class="weather-detail-label">Humidity</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value">' + Math.round(current.wind_speed_10m) + ' km/h</div><div class="weather-detail-label">Wind</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value" style="color: ' + uvColor + ';">' + uvIndex.toFixed(1) + '</div><div class="weather-detail-label">UV Index (' + uvAdvisory + ')</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value">' + maxTemp + '°C</div><div class="weather-detail-label">High</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value">' + Math.round(daily.temperature_2m_min[0]) + '°C</div><div class="weather-detail-label">Low</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value">' + sunrise + '</div><div class="weather-detail-label">Sunrise</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value">' + sunset + '</div><div class="weather-detail-label">Sunset</div></div>' +
                '<div class="weather-detail"><div class="weather-detail-value">' + (daily.uv_index_max[0] ? daily.uv_index_max[0].toFixed(1) : '--') + '</div><div class="weather-detail-label">Max UV Today</div></div>' +
                '</div></div>';
        })
        .catch(function(error) {
            widget.innerHTML = '<div style="text-align: center;"><div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Unable to load weather data</div><div style="font-size: 0.9rem; opacity: 0.7;">Please check your internet connection</div></div>';
        });
}

// Load weather on page load
loadWeather();

// Refresh weather every 30 minutes
setInterval(loadWeather, 30 * 60 * 1000);

// ============================================
// SOLAR CALCULATOR
// ============================================
function calculateSolar() {
    const roofAreaCents = parseFloat(document.getElementById('roofArea').value) || 5;
    const electricityRate = parseFloat(document.getElementById('electricityRate').value) || 5.5;
    const systemCost = parseFloat(document.getElementById('systemCost').value) || 50;

    // Convert cents to sq meters (1 cent = 40.47 m²)
    const roofAreaSqm = roofAreaCents * 40.47;

    // Anantapur solar irradiance: 5.7 kWh/m²/day
    const irradiance = 5.7;
    const systemEfficiency = 0.80;
    const daysPerYear = 365;
    const panelLifespan = 25;
    const wattsPerSqm = 150; // typical rooftop solar

    // Calculations
    const capacityKW = (roofAreaSqm * wattsPerSqm) / 1000;
    const annualGeneration = capacityKW * irradiance * daysPerYear * systemEfficiency;
    const annualSavings = annualGeneration * electricityRate;
    const totalSystemCost = capacityKW * 1000 * systemCost;
    const paybackYears = totalSystemCost / annualSavings;
    const co2Offset = annualGeneration * 0.82 / 1000; // 0.82 kg CO2 per kWh (India grid)
    const lifetimeSavings = (annualSavings * panelLifespan) - totalSystemCost;

    // Update UI
    document.getElementById('solarCapacity').textContent = capacityKW.toFixed(1);
    document.getElementById('solarGeneration').textContent = Math.round(annualGeneration).toLocaleString('en-IN');
    document.getElementById('solarSavings').textContent = '₹' + Math.round(annualSavings).toLocaleString('en-IN');
    document.getElementById('solarPayback').textContent = paybackYears.toFixed(1);
    document.getElementById('solarCO2').textContent = co2Offset.toFixed(1);
    document.getElementById('solarLifetime').textContent = '₹' + Math.round(lifetimeSavings).toLocaleString('en-IN');
}

// Initialize solar calculator
const solarInputs = document.querySelectorAll('#roofArea, #electricityRate, #systemCost');
solarInputs.forEach(input => {
    input.addEventListener('input', calculateSolar);
});
calculateSolar(); // Run on load

// ============================================
// AQI WIDGET
// ============================================
async function loadAQI() {
    const widget = document.getElementById('aqiWidget');
    if (!widget) return;

    // Anantapur coordinates
    const lat = 14.6819;
    const lon = 77.6006;

    try {
        const response = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide&timezone=Asia/Kolkata`
        );
        const data = await response.json();
        const current = data.current;

        // Calculate AQI (simplified US EPA method)
        const pm25 = current.pm2_5 || 0;
        const pm10 = current.pm10 || 0;

        // AQI breakpoints for PM2.5
        function getAQI(pm25) {
            if (pm25 <= 12) return { aqi: Math.round(pm25 * 50/12), status: 'Good', color: '#22c55e', advice: 'Air quality is satisfactory.' };
            if (pm25 <= 35.4) return { aqi: Math.round(50 + (pm25-12) * 50/23.4), status: 'Moderate', color: '#eab308', advice: 'Acceptable quality. Sensitive groups should limit prolonged outdoor exertion.' };
            if (pm25 <= 55.4) return { aqi: Math.round(100 + (pm25-35.4) * 50/20), status: 'Unhealthy for Sensitive', color: '#f97316', advice: 'Sensitive groups should reduce prolonged outdoor exertion.' };
            if (pm25 <= 150.4) return { aqi: Math.round(150 + (pm25-55.4) * 50/95), status: 'Unhealthy', color: '#ef4444', advice: 'Everyone should limit prolonged outdoor exertion.' };
            if (pm25 <= 250.4) return { aqi: Math.round(200 + (pm25-150.4) * 100/100), status: 'Very Unhealthy', color: '#a855f7', advice: 'Everyone should avoid prolonged outdoor exertion.' };
            return { aqi: 300 + Math.round((pm25-250.4) * 100/150), status: 'Hazardous', color: '#7f1d1d', advice: 'Everyone should avoid all outdoor exertion.' };
        }

        const aqi = getAQI(pm25);

        widget.innerHTML = `
            <div class="aqi-content">
                <div class="aqi-main">
                    <div class="aqi-value" style="color: ${aqi.color};">${aqi.aqi}</div>
                    <div>
                        <div class="aqi-status">${aqi.status}</div>
                        <div class="aqi-advice">${aqi.advice}</div>
                    </div>
                </div>
                <div class="aqi-details">
                    <div class="aqi-detail">
                        <div class="aqi-detail-value">${pm25.toFixed(1)}</div>
                        <div class="aqi-detail-label">PM2.5 (μg/m³)</div>
                    </div>
                    <div class="aqi-detail">
                        <div class="aqi-detail-value">${pm10.toFixed(1)}</div>
                        <div class="aqi-detail-label">PM10 (μg/m³)</div>
                    </div>
                    <div class="aqi-detail">
                        <div class="aqi-detail-value">${(current.carbon_monoxide || 0).toFixed(1)}</div>
                        <div class="aqi-detail-label">CO (μg/m³)</div>
                    </div>
                    <div class="aqi-detail">
                        <div class="aqi-detail-value">${(current.nitrogen_dioxide || 0).toFixed(1)}</div>
                        <div class="aqi-detail-label">NO₂ (μg/m³)</div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        widget.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Unable to load air quality data</div>
                <div style="font-size: 0.9rem; opacity: 0.7;">Please check your internet connection</div>
            </div>
        `;
    }
}

loadAQI();
setInterval(loadAQI, 60 * 60 * 1000); // Refresh every hour

// ============================================
// CLIMATE DASHBOARD
// ============================================
function initClimateCharts() {
    // Anantapur climate data (1991-2020 normals)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const tempData = {
        labels: months,
        datasets: [{
            label: 'Avg High (°C)',
            data: [31.5, 34.2, 37.8, 40.1, 40.5, 36.8, 33.2, 32.5, 33.1, 33.2, 31.2, 30.1],
            borderColor: '#f5576c',
            backgroundColor: 'rgba(245, 87, 108, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Avg Low (°C)',
            data: [16.2, 18.5, 22.1, 25.3, 26.8, 24.5, 23.1, 23.0, 23.2, 22.1, 19.2, 16.8],
            borderColor: '#4facfe',
            backgroundColor: 'rgba(79, 172, 254, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const rainData = {
        labels: months,
        datasets: [{
            label: 'Rainfall (mm)',
            data: [3, 5, 12, 28, 52, 89, 112, 128, 135, 98, 42, 8],
            backgroundColor: 'rgba(67, 233, 123, 0.6)',
            borderColor: '#43e97b',
            borderWidth: 2,
            borderRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#64748b', font: { family: 'Inter' } }
            }
        },
        scales: {
            x: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            },
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(148, 163, 184, 0.1)' }
            }
        }
    };

    // Temperature chart
    const tempCtx = document.getElementById('tempChart');
    if (tempCtx) {
        new Chart(tempCtx, {
            type: 'line',
            data: tempData,
            options: { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'top' } } }
        });
    }

    // Rainfall chart
    const rainCtx = document.getElementById('rainChart');
    if (rainCtx) {
        new Chart(rainCtx, {
            type: 'bar',
            data: rainData,
            options: chartOptions
        });
    }
}

// Initialize charts when DOM is ready
if (document.getElementById('tempChart')) {
    initClimateCharts();
}

// ============================================
// ATM FINDER - OpenStreetMap Overpass API
// ============================================
const findAtmBtn = document.getElementById('findAtmBtn');
const atmResults = document.getElementById('atmResults');

if (findAtmBtn) {
    findAtmBtn.addEventListener('click', async () => {
        atmResults.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 1rem;">Finding ATMs near you...</p>';

        let lat, lon;

        // Try to get user's location
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
                lat = position.coords.latitude;
                lon = position.coords.longitude;
            } catch {
                // Fallback to Anantapur center
                lat = 14.6819;
                lon = 77.6006;
            }
        } else {
            lat = 14.6819;
            lon = 77.6006;
        }

        try {
            // Overpass API query for ATMs within 5km
            const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="atm"](around:5000,${lat},${lon});
                  node["amenity"="bank"](around:5000,${lat},${lon});
                );
                out body;
            `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });
            const data = await response.json();

            if (data.elements.length === 0) {
                atmResults.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 1rem;">No ATMs found nearby. Try expanding your search area.</p>';
                return;
            }

            // Calculate distances and sort
            const atms = data.elements.map(el => {
                const distance = getDistance(lat, lon, el.lat, el.lon);
                return { ...el, distance };
            }).sort((a, b) => a.distance - b.distance).slice(0, 8);

            atmResults.innerHTML = atms.map(atm => {
                const name = atm.tags?.name || atm.tags?.operator || 'ATM';
                const operator = atm.tags?.operator || '';
                const distance = atm.distance < 1 ? `${Math.round(atm.distance * 1000)}m` : `${atm.distance.toFixed(1)}km`;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${atm.lat},${atm.lon}`;

                return `
                    <div class="atm-result-card">
                        <div class="atm-result-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        </div>
                        <div class="atm-result-info">
                            <div class="atm-result-name">${name}</div>
                            <div class="atm-result-distance">${operator ? operator + ' • ' : ''}${distance} away</div>
                        </div>
                        <a href="${mapsUrl}" target="_blank" rel="noopener" class="atm-result-link">Directions</a>
                    </div>
                `;
            }).join('');
        } catch (error) {
            atmResults.innerHTML = '<p style="color: var(--gray-500); text-align: center; padding: 1rem;">Unable to fetch ATM data. Please try again.</p>';
        }
    });
}

// Haversine distance formula (returns km)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ============================================
// TELUGU / ENGLISH TOGGLE
// ============================================
const translations = {
    en: {
        'nav-explore': 'All Features',
        'nav-essentials': 'Emergency & Weather',
        'nav-tech': 'Solar & Climate',
        'nav-directory': 'Business Directory',
        'nav-about': 'About',
        'hero-badge': 'Anantapur, Andhra Pradesh',
        'hero-title-line': 'The Digital Heart of',
        'hero-title-highlight': 'Anantapur City',
        'hero-subtitle': 'Your gateway to local news, business directory, city planning, government services, and everything that makes 515001 home.',
    },
    te: {
        'nav-explore': 'అన్ని ఫీచర్లు',
        'nav-essentials': 'అత్యవసర & వాతావరణం',
        'nav-tech': 'సోలార్ & వాతావరణం',
        'nav-directory': 'వ్యాపార డైరెక్టరీ',
        'nav-about': 'మా గురించి',
        'hero-badge': 'అనంతపురం, ఆంధ్రప్రదేశ్',
        'hero-title-line': 'డిజిటల్ హృదయం',
        'hero-title-highlight': 'అనంతపురం నగరం',
        'hero-subtitle': 'స్థానిక వార్తలు, వ్యాపార డైరెక్టరీ, నగర ప్రణాళిక, ప్రభుత్వ సేవలు మరియు 515001 ఇంటికి సంబంధించిన అన్నింటికీ మీ ప్రవేశ ద్వారం.',
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Save preference
    localStorage.setItem('preferred-lang', lang);
}

// Initialize language
const savedLang = localStorage.getItem('preferred-lang') || 'en';
setLanguage(savedLang);

// Language button handlers
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// ============================================
// WHATSAPP SHARE BUTTON
// ============================================
const whatsappBtn = document.getElementById('whatsappShare');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out 515001.com - Anantapur City Portal! Everything about our city in one place.');
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// BUSINESS DIRECTORY - Filter & Search
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const businessCards = document.querySelectorAll('.business-card');
const searchInput = document.getElementById('businessSearch');

function filterBusinesses() {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    const searchTerm = searchInput?.value.toLowerCase() || '';

    businessCards.forEach(card => {
        const category = card.dataset.category;
        const text = card.textContent.toLowerCase();

        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesSearch = text.includes(searchTerm);

        card.classList.toggle('hidden', !(matchesCategory && matchesSearch));
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterBusinesses();
    });
});

if (searchInput) {
    searchInput.addEventListener('input', filterBusinesses);
}

// ============================================
// POPUP BANNER - Auto show after 3s, dismiss after 8s
// ============================================
const popupBanner = document.getElementById('popupBanner');
const popupClose = document.getElementById('popupClose');

if (popupBanner && popupClose) {
    // Show popup after 3 seconds
    const showTimer = setTimeout(() => {
        popupBanner.classList.add('visible');
    }, 3000);

    // Auto-dismiss after 8 seconds (3s delay + 8s visible = 11s total)
    const hideTimer = setTimeout(() => {
        popupBanner.classList.remove('visible');
    }, 11000);

    // Manual close
    popupClose.addEventListener('click', () => {
        popupBanner.classList.remove('visible');
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
    });
}

// ============================================
// BIRD IMAGE FALLBACK - Show gradient with bird silhouette if image fails
// ============================================
document.querySelectorAll('.bird-img').forEach(img => {
    img.addEventListener('error', function() {
        const card = this.closest('.bird-card');
        const birdName = card.querySelector('h4').textContent;
        this.style.display = 'none';
        
        // Create fallback gradient div with bird silhouette
        const fallback = document.createElement('div');
        fallback.className = 'bird-img-fallback';
        fallback.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" style="margin-bottom: 0.5rem;"><path d="M22 12c0-4.4-3.6-8-8-8-3.3 0-6.1 2-7.4 4.9C3.1 9.6 1 12.6 1 16c0 2.2 1.8 4 4 4h14c1.7 0 3-1.3 3-3z"/><path d="M12 4c1.5 2 2.5 4.5 2.5 7.5S13.5 17 12 19"/></svg><div style="font-size: 0.9rem; font-weight: 600;">${birdName}</div>`;
        this.parentNode.insertBefore(fallback, this.nextSibling);
    });
});
