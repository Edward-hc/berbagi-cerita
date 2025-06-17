const createStoryItemTemplate = (story) => `
  <article class="story-item">
    <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" class="story-img" />
    <h3>${story.name}</h3>
    <p>${story.description}</p>
    <small>Lokasi: ${story.lat}, ${story.lon}</small>
  </article>
`;

const StoryListView = {
  init(container) {
    this._container = container;
    this._container.innerHTML = `
      <section>
        <h2>Daftar Cerita</h2>
        <div id="story-list" class="story-list"></div>
      </section>
    `;
  },

  renderStories(stories) {
    const storyListElement = this._container.querySelector('#story-list');
    storyListElement.innerHTML = stories.map(createStoryItemTemplate).join('');
  },

  renderError(message) {
    this._container.innerHTML = `<p>${message}</p>`;
  }
};

export default StoryListView;
