/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import _ from 'lodash';
import i18n from 'i18next';
import { setLocale } from 'yup';
import resources from './locales/index';
import initView from './view';

const feedbackMessages = {
  uploadSuccess: 'feedbacks.upload_success',
  nonValidRss: 'feedbacks.non_valid_rss',
  netWorkError: 'feedbacks.network_error',
  doublesAlert: 'feedbacks.doubles_alert',
};

const makeFetch = (link, watchState) => fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
  .catch((e) => {
    watchState.form.feedbackMessage = feedbackMessages.netWorkError;
    watchState.form.processState = 'filling';
    console.log(e);
    throw new Error('netWorkError');
  });

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const getNewPosts = (watchState, link, delay) => {
  setTimeout(() => {
    makeFetch(link, watchState)
      .then((response) => response.json())
      .then((responce) => {
        watchState.data.newPostsData = responce.contents;
      })
      .catch((err) => {
        watchState.form.processError = errorMessages.network.error;
        throw err;
      });
    getNewPosts(watchState, link, delay);
  }, delay);
};

const processData = (watchState, value) => {
  makeFetch(value, watchState)
    .then((response) => response.json())
    .then((responce) => {
      if (responce.contents === null) {
        throw new Error('nonValidRss');
      }
      watchState.data.responceData = responce.contents;
      watchState.form.currentLink = value;
      watchState.data.linksHistory.push(value);
      watchState.form.processState = 'finished';
      watchState.form.feedbackMessage = feedbackMessages.uploadSuccess;
      getNewPosts(watchState, watchState.form.currentLink, 5000);
    })
    .catch((e) => {
      watchState.form.feedbackMessage = feedbackMessages[e.message];
      watchState.form.processState = 'filling';
      console.log(e);
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
    .notOneOf([watchState.data.linksHistory], feedbackMessages.doublesAlert);
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
      isValidValue: true,
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
