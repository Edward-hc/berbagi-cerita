import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import AddStoryPage from '../pages/add/add-page';
import SavedStoriesPage from '../pages/saved-stories-page.js';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/add': AddStoryPage,
  '/saved': SavedStoriesPage,
  '/about': new AboutPage(),
};

export default routes;
