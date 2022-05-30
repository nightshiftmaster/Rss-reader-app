import onChange from 'on-change';
import builders from './tools/index';
import normalizeData from './tools/normalize';
import makeParse from './tools/parser';

const { feedsListBuilder, postsListBuilder, modalWindowBuilder } = builders;

const responceDataHandler = (responce, state, elements, i18Instance) => {
  const parsedData = makeParse(responce);
  const normalizedData = normalizeData(parsedData, state);
  const feedsList = feedsListBuilder(normalizedData);
  const postsList = postsListBuilder(normalizedData, i18Instance);
  const modalWindow = modalWindowBuilder(elements, normalizedData, i18Instance);
  return [feedsList, postsList, modalWindow];
};

const newPostsDataHandler = (responce, state, elements, i18Instance) => {
  const parsedData = makeParse(responce);
  const normalizedData = normalizeData(parsedData, state);
  const postsList = postsListBuilder(normalizedData, i18Instance);
  const modalWindow = modalWindowBuilder(elements, normalizedData, i18Instance);
  return [postsList, modalWindow];
};

const processErrorHandler = (message) => {
  console.log(message);
};

const errorsHandler = (elements, error, i18Instance) => {
  const { feedbackElement } = elements;
  switch (error) {
    case 'feedbacks.doubles_alert':
      elements.inputField.classList.add('is-invalid');
      feedbackElement.classList.add('text-danger');
      feedbackElement.classList.remove('text-success');
      feedbackElement.textContent = i18Instance.t(error);
      break;
    case 'feedbacks.invalid_url':
      elements.inputField.classList.add('is-invalid');
      feedbackElement.classList.add('text-danger');
      feedbackElement.classList.remove('text-success');
      feedbackElement.textContent = i18Instance.t(error);
      break;
    case 'feedbacks.non_valid_rss':
      elements.inputField.classList.add('is-invalid');
      feedbackElement.classList.add('text-danger');
      feedbackElement.classList.remove('text-success');
      feedbackElement.textContent = i18Instance.t(error);
      break;
    case 'feedbacks.network_error':
      elements.inputField.classList.add('is-invalid');
      feedbackElement.classList.add('text-danger');
      feedbackElement.classList.remove('text-success');
      feedbackElement.textContent = i18Instance.t(error);
      break;
    case 'feedbacks.upload_success':
      elements.inputField.classList.remove('is-invalid');
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = i18Instance.t('feedbacks.upload_success');
      elements.form.reset();
      elements.inputField.focus();
      break;
    default:
      break;
  }
};

const processStateHandler = (elements, process, i18instance) => {
  const { submitButton, feedsContainer, postsContainer } = elements;
  const postContainerTitle = postsContainer.querySelector('h2');
  const feedsContainerTitle = feedsContainer.querySelector('h2');
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
      feedsContainer.hidden = false;
      postsContainer.hidden = false;
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
      errorsHandler(elements, curr, i18instance);
      break;

    case 'responceData':
      responceDataHandler(curr, state, elements, i18instance);
      break;

    case 'newPostsData':
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
