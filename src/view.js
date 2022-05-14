import onChange from 'on-change';

const errorsHandler = (elements, error, i18nInstance) => {
  const { feedbackElement } = elements;
  if (error === 'double') {
    elements.inputField.classList.add('is-invalid');
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = i18nInstance.t('feedbacks.doubles_alert');
  } else if (error.length !== 0) {
    elements.inputField.classList.add('is-invalid');
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = i18nInstance.t('feedbacks.invalid_url');
  } else {
    elements.inputField.classList.remove('is-invalid');
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
    feedbackElement.textContent = i18nInstance.t('feedbacks.upload_success');
    elements.form.reset();
    elements.inputField.focus();
  }
};

const processStateHandler = (elements, process) => {
  const { submitButton } = elements;
  switch (process) {
    case 'filling':
      submitButton.disabled = false;
      break;

    case 'sending':
      submitButton.disabled = true;
      break;

    default:
      break;
  }
};

const initView = (state, elements, i18instance) => onChange(state, (path, curr) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(elements, curr);
      break;

    case 'form.errors':
      errorsHandler(elements, curr, i18instance);
      break;

    default:
      break;
  }
});

export default initView;
