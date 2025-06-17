const BASE_URL = 'https://story-api.dicoding.dev/v1';

const StoryModel = {
  async getStories() {
    const token = localStorage.getItem('token');
    console.log('[DEBUG] Token:', token); // Tambahan log

    const response = await fetch(`${BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Biar tahu error aslinya
      console.error('[DEBUG] Response Error:', errorText); // Tambahan log
      throw new Error('Gagal mengambil data cerita');
    }

    const result = await response.json();
    return result.listStory;
  },

  async addStory(formData) {
    const token = localStorage.getItem('token');
    console.log('[DEBUG] Token (POST):', token); // Tambahan log

    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('[DEBUG] Post Error:', err); // Tambahan log
      throw new Error(`Gagal menambahkan cerita: ${err.message}`);
    }

    return await response.json();
  },
};

export default StoryModel;
