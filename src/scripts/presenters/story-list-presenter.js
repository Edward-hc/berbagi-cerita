import StoryModel from '../models/story-model';
import StoryListView from '../views/story-list-view';
import MapView from '../views/map-view';

const StoryListPresenter = {
  async init(container) {
    StoryListView.init(container);
    MapView.init(container); 

    try {
      const stories = await StoryModel.getStories();
      StoryListView.renderStories(stories);
      MapView.renderMap(stories); 
    } catch (error) {
      StoryListView.renderError(error.message);
    }
  },
};

export default StoryListPresenter;
