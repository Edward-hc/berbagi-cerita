import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = {
  init(container) {
  this._container = container;

  const title = document.createElement('h2');
  title.textContent = 'Lokasi Cerita';
  title.style.marginTop = '40px';
  this._container.appendChild(title);

  const mapContainer = document.createElement('div');
  mapContainer.id = 'map';
  mapContainer.style.height = '400px';
  mapContainer.style.marginTop = '20px';

  this._container.appendChild(mapContainer);
},

  renderMap(stories) {
    // Tambahkan fix untuk ikon marker
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map('map').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });
  }
};

export default MapView;
