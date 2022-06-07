import * as yup from 'yup';
import { setLocale } from 'yup';

export default (field, watchState) => {
  const alreadyExists = watchState.data.linksHistory;
  setLocale({
    string: {
      url: 'feedbacks.invalid_url',
    },
  });
  const schema = yup.string().required().url()
    .nullable()
    .notOneOf(alreadyExists, 'feedbacks.doubles_alert');
  try {
    return schema.validate(field);
  } catch (e) {
    return e;
  }
};
