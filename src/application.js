/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import i18n from 'i18next';
import resources from './locales/index';
import initView from './view';
import processData from './tools/getData';
import validate from './tools/validator';

export default () => {
  const i18instance = i18n.createInstance();
  i18instance.init({
    lng: 'ru',
    resources,
  }).then((t) => { t('key'); });

  const elements = {
    modalWindowElements: {
      modalHeader: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalControl: {
        closeModal: document.querySelectorAll('[data-bs-dismiss="modal"]'),
        fullArticle: document.querySelector('.full-article'),
      },
    },
    containers: {
      posts: {
        postsColumn: document.querySelector('.posts'),
        postsList: document.querySelector('.posts .list-group'),
      },
      feeds: {
        feedsColumn: document.querySelector('.feeds'),
        feedsList: document.querySelector('.feeds .list-group'),
      },
    },
    form: document.querySelector('form'),
    submitButton: document.querySelector('[type="submit"]'),
    inputField: document.querySelector('input'),
    feedbackElement: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      processState: 'filling',
      feedbackMessage: {},
      input: '',
      currentLink: '',
      processError: '',
    },
    data: {
      responceData: null,
      newPostsData: null,
      postsHistory: [],
      linksHistory: [],
    },
  };

  const watchState = initView(state, elements, i18instance);
  elements.inputField.addEventListener('change', (e) => {
    e.preventDefault();
    const { value } = e.target;
    watchState.form.input = value;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = watchState.form.input;
    validate(value, watchState)
      .then((data) => {
        elements.feedbackElement.textContent = '';
        watchState.form.processState = 'sending';
        return processData(watchState, data);
      })
      .catch((error) => {
        console.log(error);
        watchState.form.feedbackMessage = error.message;
      });
  });
};
