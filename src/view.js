/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import onChange from 'on-change';
import renders from './tools/renders';
import { normalizeData } from './tools/normalize';
import makeParse from './tools/parserRss';

const { modalWindowRender, postsRender, feedsRender } = renders;

const processErrorHandler = (message) => {
  console.log(message);
};

const isValidFormHandler = (status, elements) => {
  const result = status === true ? elements.inputField.classList.remove('is-invalid')
    : elements.inputField.classList.add('is-invalid');
  return result;
};

const responceDataHandler = (responce, state, elements, i18Instance) => {
  const parsedData = makeParse(responce);
  const normalizedData = normalizeData(parsedData, state);
  feedsRender(normalizedData, elements);
  postsRender(normalizedData, elements, i18Instance);
  modalWindowRender(elements, normalizedData, i18Instance);
};

const newPostsDataHandler = (responce, state, elements, i18Instance) => {
  const parsedData = makeParse(responce);
  const normalizedData = normalizeData(parsedData, state);
  postsRender(normalizedData, elements, i18Instance);
  modalWindowRender(elements, normalizedData, i18Instance);
};

const feedbackMessagesHandler = (elements, message, i18Instance) => {
  const { feedbackElement } = elements;
  if (message !== 'feedbacks.upload_success') {
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = i18Instance.t(message);
  } else {
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
    feedbackElement.textContent = i18Instance.t(message);
  }
};

const processStateHandler = (elements, process, i18instance) => {
  const { submitButton } = elements;
  const { postsColumn } = elements.containers.posts;
  const { feedsColumn } = elements.containers.feeds;
  const postContainerTitle = postsColumn.querySelector('h2');
  const feedsContainerTitle = feedsColumn.querySelector('h2');
  switch (process) {
    case 'filling':
      submitButton.disabled = false;
      break;

    case 'sending':
      submitButton.disabled = true;
      break;

    case 'finished':
      postContainerTitle.textContent = i18instance.t('containers.postsContainer_title');
      feedsContainerTitle.textContent = i18instance.t('containers.feedsContainer_title');
      submitButton.disabled = false;
      postsColumn.hidden = false;
      feedsColumn.hidden = false;
      break;

    default:
      break;
  }
};

const initView = (state, elements, i18instance) => onChange(state, (path, curr) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(elements, curr, i18instance);
      break;

    case 'form.feedbackMessage':
      feedbackMessagesHandler(elements, curr, i18instance);
      break;

    case 'data.responceData':
      responceDataHandler(curr, state, elements, i18instance);
      break;

    case 'data.newPostsData':
      newPostsDataHandler(curr, state, elements, i18instance);
      break;

    case 'form.processError':
      processErrorHandler(curr);
      break;

    case 'form.valid':
      isValidFormHandler(curr, elements);
      break;

    default:
      break;
  }
});

export default initView;
