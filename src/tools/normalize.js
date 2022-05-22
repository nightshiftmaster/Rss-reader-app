import _ from 'lodash';

export default (parsedData) => ({
  title: parsedData.querySelector('title').textContent,
  description: parsedData.querySelector('description').textContent,
  posts: [...parsedData.querySelectorAll('item')].reduce((acc, item) => {
    const title = item.querySelector('title').textContent;
    const dataId = _.uniqueId();
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    acc.push({
      title, description, dataId, link,
    });
    return acc;
  }, []),
});
