import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import _ from 'lodash';
import i18n from 'i18next';
import { setLocale } from 'yup';
import resources from './locales/index';
import initView from './view';

const getNewPosts = (watchState, link) => {
  setTimeout(() => {
    fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
      .then((response) => response.json())
      .then((responce) => watchState.newPostsData = responce)
      .catch((err) => {
        watchState.form.processError = 'Network Error';
        throw err;
      });
    getNewPosts(watchState, link);
  }, 5000);
};

const processData = (watchState, value) => {
  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(value)}`)
    .then((response) => response.json())
    .then((responce) => {
      const statusError = responce.status.error;
      const status = responce.status.http_code;
      const result = status !== 404 && !statusError ? [
        watchState.currentLink = value,
        watchState.responceData = responce,
        watchState.form.feeds.push(value),
        watchState.form.processState = 'finished',
        watchState.form.feedbackMessage = 'feedbacks.upload_success',
        getNewPosts(watchState, watchState.currentLink),

      ]
        : [watchState.form.feedbackMessage = 'feedbacks.non_valid_rss',
          watchState.form.processState = 'filling'];
      return result;
    })
    .catch((err) => {
      watchState.form.feedbackMessage = 'feedbacks.network_error';
      watchState.form.processState = 'filling';
      console.log(err);
    });
};

const validated = async (field, watchState) => {
  setLocale({
    string: {
      url: 'feedbacks.invalid_url',
    },
  });
  const schema = yup.string().required().url()
    .nullable()
    .notOneOf([watchState.form.feeds], 'feedbacks.doubles_alert');
  try {
    await schema.validate(field);
    return '';
  } catch (e) {
    return e.message;
  }
};

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
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    form: document.querySelector('form'),
    submitButton: document.querySelector('[type="submit"]'),
    inputField: document.querySelector('input'),
    feedbackElement: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      isValidValue: true,
      processState: 'filling',
      feedbackMessage: {},
      input: '',
      feeds: [],
      processError: '',
    },
    responceData: null,
    newPostsData: null,
    currentLink: null,
    postColl: [],
    feedsColl: null,
  };

  const watchState = initView(state, elements, i18instance);
  elements.inputField.addEventListener('change', (e) => {
    e.preventDefault();
    const { value } = e.target;
    watchState.form.input = value;
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let { isValidValue } = watchState.form;
    const value = watchState.form.input;
    const error = await validated(value, watchState);
    isValidValue = _.isEmpty(error);
    watchState.form.feedbackMessage = error;
    if (isValidValue) {
      elements.feedbackElement.textContent = '';
      watchState.form.processState = 'sending';
      processData(watchState, value);
    }
  });
};
