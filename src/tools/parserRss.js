import normalizeData from './normalize';

export default (data) => {
  if (data.includes('<channel>')) {
    const parser = new DOMParser();
    const htmlString = data;
    const paredData = parser.parseFromString(htmlString, 'application/xml');
    return normalizeData(paredData);
  }
  throw new Error('nonValidRss');
};
