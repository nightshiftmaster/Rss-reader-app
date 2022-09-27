import _ from 'lodash';

const normalizeData = (parsedData) => {
  const feedId = _.uniqueId();
  const items = [...parsedData.querySelectorAll('item')];
  return {
    title: parsedData.querySelector('title').textContent,
    description: parsedData.querySelector('description').textContent,
    url: parsedData.querySelector('link').textContent,
    id: feedId,
    posts: items.reduce((acc, item) => {
      const title = item.querySelector('title').textContent;
      const id = _.uniqueId();
      const description = item.querySelector('description').textContent;
      const url = item.querySelector('link').textContent;
      acc.push({
        title, description, channelId: feedId, id, url,
      });
      return acc;
    }, []),
  };
};

export default (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data, 'application/xml');
  const parserError = parsedData.querySelector('parsererror');
  if (parserError === null) {
    return normalizeData(parsedData);
  }
  throw new Error('nonValidRss');
};
