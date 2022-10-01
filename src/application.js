import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from 'i18next';
import resources from './locales/index';
import initView from './view';
import { validate, fetchNewPosts, loadRss } from './tools';

export default () => {
  const i18instance = i18n.createInstance();
  i18instance.init({
    lng: 'ru',
    resources,
  });
  const elements = {
    modal: document.getElementById('modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    openArticleButton: document.querySelector('.full-article'),
    closeArticleButton: document.querySelector('.modal-footer .btn-secondary'),
    posts: document.querySelector('.posts'),
    postsContainer: document.querySelector('.posts .list-group'),
    feeds: document.querySelector('.feeds'),
    feedsContainer: document.querySelector('.feeds .list-group'),
    form: document.querySelector('form'),
    submitButton: document.querySelector('[type="submit"]'),
    inputField: document.querySelector('input'),
    feedbackElement: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      processState: 'filling',
      feedbackMessage: '',
    },
    data: {
      feeds: [],
      posts: [],
      viewedPostsIds: new Set(),
    },
    modal: {
      currentPostId: null,
    },
  };

  const watchState = initView(state, elements, i18instance);
  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputValue = formData.get('url');
    validate(inputValue, watchState)
      .then((url) => {
        watchState.form.feedbackMessage = '';
        watchState.form.processState = 'sending';
        loadRss(watchState, url);
      })
      .catch((error) => {
        watchState.form.feedbackMessage = error.message;
      });
  });
  elements.posts.addEventListener('click', (event) => {
    switch (event.target.className) {
      case ('btn btn-outline-primary btn-sm'):
        watchState.modal.currentPostId = event.target.id;
        watchState.data.viewedPostsIds.add(event.target.id);
        break;
      case ('btn-close close'):
        watchState.modal.currentPostId = null;
        break;
      case ('btn btn-secondary'):
        watchState.modal.currentPostId = null;
        break;
      default:
        break;
    }
  });
  fetchNewPosts(watchState);
};
