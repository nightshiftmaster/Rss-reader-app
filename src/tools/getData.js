/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const feedbackMessages = {
  uploadSuccess: 'feedbacks.upload_success',
  nonValidRss: 'feedbacks.non_valid_rss',
  netWorkError: 'feedbacks.network_error',
  doublesAlert: 'feedbacks.doubles_alert',
};

const makeFetch = (link) => {
  const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${link}`;
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
        watchState.data.newPostsData = responce.contents;
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
      if (responce.contents === null || responce.contents.length === 0) {
        throw new Error('nonValidRss');
      }
      watchState.data.responceData = responce.contents;
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
