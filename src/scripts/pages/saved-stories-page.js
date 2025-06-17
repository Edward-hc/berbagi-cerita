import CeritaDB from '../utils/db.js';

const SavedStoriesPage = {
  async render() {
    return `
      <section class="saved-page" style="padding: 2rem;">
        <h2 style="text-align:center; margin-bottom: 1rem;">📚 Cerita Tersimpan (Offline)</h2>
        <div id="cerita-container" class="cerita-container" style="display:flex; flex-direction:column; gap:1.5rem;"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('cerita-container');
    const ceritaList = await CeritaDB.semuaCerita();

    if (ceritaList.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:gray;">Belum ada cerita offline tersimpan.</p>';
      return;
    }

    ceritaList.forEach(cerita => {
      const el = document.createElement('div');
      el.className = 'cerita-item';
      el.style.cssText = `
        background: #fff;
        border-radius: 12px;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      `;

      el.innerHTML = `
        <p><strong>Deskripsi:</strong> ${cerita.description}</p>
        ${cerita.photo ? `<img src="${cerita.photo}" alt="Foto Cerita" style="width:100%; border-radius:8px; margin-top: 0.75rem;" />` : ''}
        ${cerita.lat && cerita.lon ? `<p style="margin-top: 0.5rem;"><strong>Lokasi:</strong> ${cerita.lat}, ${cerita.lon}</p>` : ''}
        <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">${new Date(cerita.date).toLocaleString()}</p>
        <button data-id="${cerita.id}" class="hapus-btn" 
                style="margin-top: 1rem; background: #e53935; color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;">
          Hapus
        </button>
      `;

      el.querySelector('button.hapus-btn').addEventListener('click', async () => {
        await CeritaDB.hapusCerita(cerita.id);
        el.remove();
        if (!container.querySelector('.cerita-item')) {
          container.innerHTML = '<p style="text-align:center; color:gray;">Semua cerita telah dihapus.</p>';
        }
      });

      container.appendChild(el);
    });
  }
};

export default SavedStoriesPage;
