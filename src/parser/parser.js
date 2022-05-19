export default (data) => {
  const parser = new DOMParser();
  const htmlString = data;
  const paredData = parser.parseFromString(htmlString, 'application/xml');
  return paredData;
};
