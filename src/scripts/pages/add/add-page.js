import AddPresenter from '../../presenters/add-presenter';
import CeritaDB from '../../utils/db.js';

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const AddStoryPage = {
  async render() {
    return `
      <section class="add-page">
        <h2>📸 Tambah Cerita Baru</h2>

        <form id="add-story-form" class="add-story-form">

          <div class="form-group">
            <label for="description">Deskripsi Cerita</label>
            <textarea id="description" name="description" rows="4" placeholder="Tulis ceritamu..." required></textarea>
          </div>

          <div class="form-group">
            <label for="photo">Ambil Gambar</label>
            <input type="file" id="photo" name="photo" accept="image/*" capture="environment" />
          </div>

          <div class="form-group">
            <label for="map">Pilih Lokasi Cerita</label>
            <div id="map" style="height: 300px; border-radius: 10px; overflow: hidden; margin-top: 5px;"></div>
          </div>

          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />

          <button type="submit" class="submit-btn">🚀 Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    // Untuk simpan stream kamera
    let videoStream = null;

    function stopVideoStream() {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }
    }

    // Matikan kamera saat pindah halaman
    window.addEventListener('hashchange', stopVideoStream);

    // Perbaiki ikon marker
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

    let marker;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lon').value = lng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map).bindPopup('Lokasi dipilih').openPopup();
    });

    const photoInput = document.getElementById('photo');
    const video = document.createElement('video');
    video.autoplay = true;
    video.style.width = '100%';
    video.style.maxHeight = '300px';
    photoInput.parentNode.insertBefore(video, photoInput);

    const previewImage = document.createElement('img');
    previewImage.style.maxWidth = '100%';
    photoInput.parentNode.appendChild(previewImage);

    let capturedImageBlob = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream = stream; 
      video.srcObject = stream;

      const canvas = document.createElement('canvas');
      const captureButton = document.createElement('button');
      captureButton.type = 'button';
      captureButton.textContent = '📷 Ambil Gambar';
      captureButton.className = 'submit-btn';
      photoInput.parentNode.appendChild(captureButton);

      captureButton.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          capturedImageBlob = blob;
          previewImage.src = URL.createObjectURL(blob);
        }, 'image/jpeg');
      });
    } catch (err) {
      console.error('Gagal mengakses kamera:', err);
    }

    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (file) {
        previewImage.src = URL.createObjectURL(file);
      }
    });

    const form = document.getElementById('add-story-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      stopVideoStream();

      const token = localStorage.getItem('token');
      const name = form.name.value;
      const description = form.description.value;
      const photo = form.photo.files[0];
      const lat = form.lat.value;
      const lon = form.lon.value;

      if (!capturedImageBlob && !photo) {
        alert("Harap ambil gambar atau pilih file terlebih dahulu.");
        return;
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', capturedImageBlob || photo);
      formData.append('lat', lat);
      formData.append('lon', lon);

      try {
        await AddPresenter.uploadStory(formData, token);
        alert('Cerita berhasil ditambahkan!');
        await CeritaDB.simpanCeritaOffline({
          description,
          lat,
          lon,
          photo: capturedImageBlob ? await blobToBase64(capturedImageBlob) : await blobToBase64(photo),
          date: new Date().toISOString(),
        });
        window.location.hash = '/';
      } catch (error) {
        alert('Gagal menambahkan cerita: ' + error.message);
      }
    });
  }
};

export default AddStoryPage;
