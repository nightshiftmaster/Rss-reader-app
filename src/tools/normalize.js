import _ from 'lodash';

const checkNewPosts = (data, state) => {
  const posts = [...data.querySelectorAll('item')];
  return posts.filter((e) => {
    const newPost = e.querySelector('title').textContent;
    return !state.postColl.includes(newPost);
  });
};

export default (parsedData, state) => ({
  title: parsedData.querySelector('title').textContent,
  description: parsedData.querySelector('description').textContent,
  posts: checkNewPosts(parsedData, state).reduce((acc, item) => {
    const title = item.querySelector('title').textContent;
    state.postColl.push(title);
    const dataId = _.uniqueId();
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    acc.push({
      title, description, dataId, link,
    });
    return acc;
  }, []),
});
