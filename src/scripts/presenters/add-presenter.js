const AddPresenter = {
  async uploadStory(formData, token) {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload gagal');
    }

    return await response.json();
  }
};

export default AddPresenter;
