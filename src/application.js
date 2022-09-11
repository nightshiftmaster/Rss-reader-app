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
  }).then((t) => {
    t('key');
    const elements = {
      modalWindow: {
        modal: document.getElementById('modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalCloseButtons: document.querySelectorAll('[data-bs-dismiss="modal"]'),
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
        feedbackMessage: '',
        currentLink: '',
        processError: '',
        valid: null,
      },
      data: {
        linksHistory: [],
        feeds: [],
        posts: [],
      },
      modal: {
        selectedPostId: null,
      },
    };

    const watchState = initView(state, elements, i18instance);
    elements.inputField.addEventListener('change', (e) => {
      e.preventDefault();
      const { value } = e.target;
      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        validate(value, watchState)
          .then((data) => {
            watchState.form.feedbackMessage = '';
            elements.feedbackElement.textContent = '';
            watchState.form.valid = true;
            watchState.form.processState = 'sending';
            processData(watchState, data, elements);
          })
          .catch((error) => {
            watchState.form.feedbackMessage = error.message;
            watchState.form.valid = false;
          });
      });
    });
    elements.containers.posts.postsList.addEventListener('click', (e) => {
      watchState.modal.selectedPostId = e.target.id;
    });
    elements.modalWindow.modalCloseButtons.forEach((modal) => modal.addEventListener('click', () => {
      elements.modalWindow.modal.style.display = 'none';
      modal.classList.remove('fade', 'show');
      state.modal.selectedPostId = null;
    }));
  });
};
