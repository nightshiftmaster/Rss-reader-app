import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import _ from 'lodash';
import initView from './view';

const validated = (field) => {
  const schema = yup.string().url().nullable();
  try {
    schema.validateSync(field);
    return '';
  } catch (e) {
    return e.message;
  }
};

export default () => {
  const elements = {
    form: document.querySelector('form'),
    submitButton: document.querySelector('button'),
    inputField: document.querySelector('input'),
    feedbackElement: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      processState: 'filling',
      errors: {},
      input: '',
      feeds: [],
    },
  };

  const watchState = initView(state, elements);

  elements.inputField.addEventListener('change', (e) => {
    e.preventDefault();
    const { value } = e.target;
    watchState.form.input = value;
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchState.form.processState = 'sending';
    const value = watchState.form.input;
    const error = validated(value);
    const feed = _.isEmpty(error) ? value : [];
    watchState.form.errors = watchState.form.feeds.includes(feed) ? 'double' : validated(feed);
    watchState.form.feeds.push(feed);
    elements.form.reset();
    elements.inputField.focus();
    watchState.form.processState = 'filling';
  });
};
