/* eslint-disable no-console */
import _ from 'lodash';

const state = {
  postsHistory: [],
};

const normalizeData = (parsedData) => {
  const checkNewPosts = (data) => {
    const posts = [...data.querySelectorAll('item')];
    return posts.filter((e) => {
      const newPost = e.querySelector('title').textContent;
      return !state.postsHistory.includes(newPost);
    });
  };
  return {
    title: parsedData.querySelector('title').textContent,
    description: parsedData.querySelector('description').textContent,
    posts: checkNewPosts(parsedData).reduce((acc, item) => {
      const title = item.querySelector('title').textContent;
      state.postsHistory.push(title);
      const id = _.uniqueId();
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;
      acc.push({
        title, description, id, link,
      });
      return acc;
    }, []),
  };
};

export default normalizeData;
