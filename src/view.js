import onChange from 'on-change';

const errorsHandler = (elements, error) => {
  const { feedbackElement } = elements;
  if (error === 'double') {
    elements.inputField.classList.add('is-invalid');
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = 'RSS уже существует';
  } else if (error.length !== 0) {
    elements.inputField.classList.add('is-invalid');
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    feedbackElement.textContent = 'Ссылка должна быть валидным URL';
  } else {
    elements.inputField.classList.remove('is-invalid');
    feedbackElement.classList.remove('text-danger');
    feedbackElement.classList.add('text-success');
    feedbackElement.textContent = 'RSS успешно загружен';
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

const initView = (state, elements) => onChange(state, (path, curr) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(elements, curr);
      break;

    case 'form.errors':
      errorsHandler(elements, curr);
      break;

    default:
      break;
  }
});

export default initView;
