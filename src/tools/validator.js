import * as yup from 'yup';

export default (field, watchState) => {
  const alreadyExists = watchState.data.feeds.map((feed) => feed.url);
  const schema = yup.string().required().url('feedbacks.invalid_url')
    .nullable()
    .notOneOf(alreadyExists, 'feedbacks.doubles_alert');
  try {
    return schema.validate(field);
  } catch (e) {
    return e;
  }
};
