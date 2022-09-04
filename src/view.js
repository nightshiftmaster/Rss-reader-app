/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import onChange from 'on-change';
import renders from './tools/renders';

const { modalWindowRender, postsRender, feedsRender } = renders;

const validateFormHandler = (status, elements) => (status ? elements.inputField.classList.remove('is-invalid')
  : elements.inputField.classList.add('is-invalid'));

const feedsHandler = (data, elements) => feedsRender(data, elements);

const postsHandler = (data, elements, i18Instance) => {
  postsRender(data, elements, i18Instance);
  modalWindowRender(elements, data, i18Instance);
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

const initView = (state, elements, i18instance) => onChange(state, (path, current) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(elements, current, i18instance);
      break;

    case 'form.feedbackMessage':
      feedbackMessagesHandler(elements, current, i18instance);
      break;

    case 'data.feeds':
      feedsHandler(current, elements);
      break;

    case 'data.posts':
      postsHandler(current, elements, i18instance);
      break;

    case 'form.processError':
      console.log(current);
      break;

    case 'form.valid':
      validateFormHandler(current, elements);
      break;

    default:
      break;
  }
});

export default initView;
