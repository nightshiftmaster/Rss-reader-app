/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import parserRss from './parserRss';

const feedbackMessages = {
  uploadSuccess: 'feedbacks.upload_success',
  nonValidRss: 'feedbacks.non_valid_rss',
  netWorkError: 'feedbacks.network_error',
  doublesAlert: 'feedbacks.doubles_alert',
};

const addProxy = (link) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('disableCache', 'true');
  urlWithProxy.searchParams.set('url', link);
  return urlWithProxy.toString();
};

const makeFetch = (link) => {
  const proxy = addProxy(link);
  return fetch(proxy)
    .catch(() => {
      throw new Error('netWorkError');
    });
};

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const getNewPosts = (watchState, link, delay) => {
  setTimeout(() => {
    makeFetch(link, watchState)
      .then((response) => response.json())
      .then((responce) => {
        const parsedData = parserRss(responce.contents);
        const { posts } = parsedData;
        watchState.data.posts = { ...watchState.data.posts, ...posts };
      })
      .catch((err) => {
        watchState.form.processError = errorMessages.network.error;
        throw err;
      });
    getNewPosts(watchState, link, delay);
  }, delay);
};

export default (watchState, value, elements) => {
  makeFetch(value, watchState)
    .then((responce) => {
      if (!responce.ok) {
        throw new Error('netWorkError');
      }
      return responce;
    }).then((responce) => responce.json())
    .then((responce) => {
      const parsedData = parserRss(responce.contents);
      const { title, description, posts } = parsedData;
      watchState.data.feeds = { title, description };
      watchState.data.posts = { posts };
      watchState.form.currentLink = value;
      watchState.data.linksHistory.push(value);
      watchState.form.processState = 'finished';
      watchState.form.feedbackMessage = feedbackMessages.uploadSuccess;
      getNewPosts(watchState, watchState.form.currentLink, 5000);
      elements.form.reset();
      elements.inputField.focus();
    })
    .catch((error) => {
      watchState.form.feedbackMessage = feedbackMessages[error.message];
      watchState.form.processState = 'filling';
      console.log(`Error: ${error.message}`);
    });
};
