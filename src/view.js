/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import onChange from 'on-change';
import renders from './tools/renders';

const { postsRender, feedsRender } = renders;

const modalDialogHandler = (postsColl, elements, current, i18Instance) => {
  const { id, display } = current;
  const {
    modal, modalTitle, modalBody, closeArticleButton,
    openArticleButton,
  } = elements.modalWindow;
  modal.style.display = display;

  switch (display) {
    case 'block': {
      const element = document.getElementById(id);
      element.classList.remove('fw-bold');
      element.classList.add('fw-normal', 'link-secondary');
      const currentPost = postsColl.find((post) => post.id === id);
      modal.classList.add('show');
      openArticleButton.textContent = i18Instance.t('buttons.open_article');
      closeArticleButton.textContent = i18Instance.t('buttons.close_article');
      openArticleButton.href = currentPost.url;
      modalBody.textContent = currentPost.description;
      modalTitle.textContent = currentPost.title;
      break;
    }
    case 'none':
      modal.classList.remove('show');
      break;

    default:
      break;
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
  const { submitButton } = elements;
  switch (process) {
    case 'filling':
      submitButton.disabled = false;
      break;

    case 'sending':
      submitButton.disabled = true;
      break;

    case 'finished':
      document.querySelector('.posts h2').textContent = i18instance.t('containers.postsContainer_title');
      document.querySelector('.feeds h2').textContent = i18instance.t('containers.feedsContainer_title');
      submitButton.disabled = false;
      document.querySelector('.posts').hidden = false;
      document.querySelector('.feeds').hidden = false;
      break;

    default:
      break;
  }
};

const initView = (state, elements, i18instance) => onChange(state, (path, current) => {
  switch (path) {
    case 'modal.currentPostAttributes':
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

    case 'form.processError':
      console.log(current);
      break;

    default:
      break;
  }
});

export default initView;
