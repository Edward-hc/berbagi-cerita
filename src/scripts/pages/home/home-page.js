import StoryListPresenter from '../../presenters/story-list-presenter';

const HomePage = {
  async render() {
  return `
    <div id="main-content" tabindex="0">
      <h2>Daftar Cerita</h2>
      <div class="story-list"></div>
      <div id="map" style="height: 400px; margin-top: 20px;"></div>
    </div>
  `;
},

  async afterRender() {
    const container = document.querySelector('#main-content');
    await StoryListPresenter.init(container);
  }
};

export default HomePage;
