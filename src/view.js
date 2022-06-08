/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import onChange from 'on-change';
import renders from './tools/renders';
import { normalizeData } from './tools/normalize';
import makeParse from './tools/parserRss';

const { modalWindowRender, postsRender, feedsRender } = renders;

const invalidFeedbacksRender = (field, feedback, i18Instance, message) => {
  field.inputField.classList.add('is-invalid');
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  feedback.textContent = i18Instance.t(message);
};

const validFeedbacksRender = (field, feedback, i18Instance, message) => {
  field.inputField.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18Instance.t(message);
  field.form.reset();
  field.inputField.focus();
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

const processErrorHandler = (message) => {
  console.log(message);
};

const feedbackMessagesHandler = (elements, message, i18Instance) => {
  const { feedbackElement } = elements;
  switch (message) {
    case 'feedbacks.doubles_alert':
      invalidFeedbacksRender(elements, feedbackElement, i18Instance, message);
      break;
    case 'feedbacks.invalid_url':
      invalidFeedbacksRender(elements, feedbackElement, i18Instance, message);
      break;
    case 'feedbacks.non_valid_rss':
      invalidFeedbacksRender(elements, feedbackElement, i18Instance, message);
      break;
    case 'feedbacks.network_error':
      invalidFeedbacksRender(elements, feedbackElement, i18Instance, message);
      break;
    case 'feedbacks.upload_success':
      validFeedbacksRender(elements, feedbackElement, i18Instance, message);
      break;
    default:
      break;
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

    default:
      break;
  }
});

export default initView;
