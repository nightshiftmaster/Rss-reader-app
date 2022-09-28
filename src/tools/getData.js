/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import _ from 'lodash';
import parseRss from './parserRss';

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

const fetchNewPosts = (watchState) => {
  const { feeds } = watchState.data;
  const promises = feeds.map((feed) => {
    const proxy = addProxy(feed.url);
    return fetch(proxy).then((responce) => responce.json()).then((responce) => {
      const parsedData = parseRss(responce.contents);
      const newPosts = parsedData.posts.map((post) => ({ ...post, channelId: feed.id }));
      const oldPosts = watchState.data.posts.filter((post) => post.channelId === feed.id);
      const finalPosts = _.differenceWith(newPosts, oldPosts, (p1, p2) => p1.title === p2.title)
        .map((post) => ({ ...post, id: _.uniqueId() }));
      watchState.data.posts.unshift(...finalPosts);
    }).catch((error) => console.log(`Error: ${error.message}`));
  });
  return Promise.all(promises).finally(() => {
    setTimeout(() => fetchNewPosts(watchState), 5000);
  });
};

const loadRss = (watchState, url) => {
  const proxy = addProxy(url);
  fetch(proxy).catch(() => {
    throw new Error('netWorkError');
  })
    .then((responce) => responce.json())
    .then((responce) => {
      const parsedData = parseRss(responce.contents);
      const {
        title, description,
      } = parsedData;
      watchState.data.feeds.push({
        title, description, url, id: _.uniqueId(),
      });
      watchState.form.processState = 'finished';
      watchState.form.feedbackMessage = feedbackMessages.uploadSuccess;
    })
    .catch((error) => {
      watchState.form.feedbackMessage = feedbackMessages[error.message];
      watchState.form.processState = 'filling';
      console.log(`Error: ${error.message}`);
    });
};

export default { fetchNewPosts, loadRss };
