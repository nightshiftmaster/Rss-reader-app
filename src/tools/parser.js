export default (data) => {
  if (data) {
    const parser = new DOMParser();
    const htmlString = data.contents;
    const paredData = parser.parseFromString(htmlString, 'application/xml');
    return paredData;
  }
  return null;
};
