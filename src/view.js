/* eslint-disable no-console */
import onChange from 'on-change';
import { postsRender, feedsRender } from './tools/renders';

const modalDialogHandler = (postsColl, elements, currentId, i18Instance) => {
  const {
    modal, modalTitle, modalBody, closeArticleButton,
    openArticleButton,
  } = elements;
  if (currentId) {
    const postElement = document.getElementById(currentId);
    postElement.classList.remove('fw-bold');
    postElement.classList.add('fw-normal', 'link-secondary');
    modal.classList.add('show');
    modal.style.display = 'block';
    const currentPost = postsColl.find((post) => post.id === currentId);
    openArticleButton.textContent = i18Instance.t('buttons.open_article');
    closeArticleButton.textContent = i18Instance.t('buttons.close_article');
    openArticleButton.href = currentPost.url;
    modalBody.textContent = currentPost.description;
    modalTitle.textContent = currentPost.title;
  } else {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
};

const inputResponseHandler = (elements, message, i18Instance) => {
  const { feedbackElement } = elements;
  if (message !== 'feedbacks.upload_success') {
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = i18Instance.t(message);
    elements.inputField.classList.add('is-invalid');
  } else {
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
    feedbackElement.textContent = i18Instance.t(message);
    elements.inputField.classList.remove('is-invalid');
    elements.form.reset();
    elements.inputField.focus();
  }
};

const processStateHandler = (elements, process, i18instance) => {
  const { submitButton, posts, feeds } = elements;
  switch (process) {
    case 'filling':
      submitButton.disabled = false;
      break;

    case 'sending':
      submitButton.disabled = true;
      break;

    case 'finished':
      submitButton.disabled = false;
      document.querySelector('.posts h2').textContent = i18instance.t('containers.postsContainer_title');
      document.querySelector('.feeds h2').textContent = i18instance.t('containers.feedsContainer_title');
      posts.hidden = false;
      feeds.hidden = false;
      break;

    default:
      break;
  }
};

const initView = (state, elements, i18instance) => onChange(state, (path, current) => {
  switch (path) {
    case 'modal.currentPostId':
      modalDialogHandler(state.data.posts, elements, current, i18instance);
      break;

    case 'form.processState':
      processStateHandler(elements, current, i18instance);
      break;

    case 'form.feedbackMessage':
      inputResponseHandler(elements, current, i18instance);
      break;

    case 'data.feeds':
      feedsRender(current, elements);
      break;

    case 'data.posts':
      postsRender(current, elements, i18instance, state.data.viewedPostsIds);
      break;

    default:
      break;
  }
});

export default initView;
