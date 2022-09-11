import normalizeData from './normalize';

export default (data) => {
  if (data.includes('<channel>')) {
    const parser = new DOMParser();
    const htmlString = data;
    const parsedData = parser.parseFromString(htmlString, 'application/xml');
    return normalizeData(parsedData);
  }
  throw new Error('nonValidRss');
};
