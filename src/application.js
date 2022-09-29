import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from 'i18next';
import resources from './locales/index';
import initView from './view';
import loaders from './tools/getData';
import validate from './tools/validator';

const { fetchNewPosts, loadRss } = loaders;

export default () => {
  const i18instance = i18n.createInstance();
  i18instance.init({
    lng: 'ru',
    resources,
  });
  const elements = {
    modalWindow: {
      modal: document.getElementById('modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      openArticleButton: document.querySelector('.full-article'),
      closeArticleButton: document.querySelector('.modal-footer .btn-secondary'),
    },

    postsContainer: document.querySelector('.posts .list-group'),

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
      viewedPostsIds: [],
    },
    modal: {
      currentPostAttributes: {},
    },
  };

  const watchState = initView(state, elements, i18instance);
  fetchNewPosts(watchState);
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
  document.querySelector('.posts').addEventListener('click', (event) => {
    const openAttributes = { id: event.target.id, display: 'block' };
    const closeAttributes = { id: null, display: 'none' };
    switch (event.target.className) {
      case ('btn-close close'):
        watchState.modal.currentPostAttributes = closeAttributes;
        break;
      case ('btn btn-secondary'):
        watchState.modal.currentPostAttributes = closeAttributes;
        break;
      case ('btn btn-outline-primary btn-sm'):
        watchState.data.viewedPostsIds.push(event.target.previousElementSibling.id);
        watchState.modal.currentPostAttributes = openAttributes;
        break;
      default:
        break;
    }
  });
};
