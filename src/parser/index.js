import _ from 'lodash';
import makeParse from './parser';

const extractData = (parsedData) => ({
  title: parsedData.querySelector('title').textContent,
  description: parsedData.querySelector('description').textContent,
  posts: [...parsedData.querySelectorAll('item')].reduce((acc, item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').nextSibling.textContent;
    acc.push({ title, description, link });
    return acc;
  }, []),
});

const postsListMaker = (element, i18Instance) => {
  const id = _.uniqueId();
  const listElement = document.createElement('li');
  const aElement = document.createElement('a');
  const button = document.createElement('button');
  listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  aElement.classList.add('fw-bold');
  aElement.href = element.link;
  aElement.textContent = element.title;
  aElement.rel = 'noopener noreferrer';
  aElement.dataset.id = id;
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.type = 'button';
  button.dataset.id = id;
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = i18Instance.t('buttons.description_window');
  listElement.append(aElement);
  listElement.append(button);
  return listElement;
};

const feedsListMaker = (data) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const header = document.createElement('h3');
  header.classList.add('h6', 'm-0');
  header.textContent = data.title;
  const paragraph = document.createElement('p');
  paragraph.classList.add('m-0', 'small', 'text-black-50');
  paragraph.textContent = data.description;
  li.append(header, paragraph);
  return li;
};

export default (responce, i18Instance) => {
  const parsedData = makeParse(responce.contents);
  const parsedDataToObject = extractData(parsedData);
  const container1 = document.querySelector('.feeds .list-group');
  container1.append(feedsListMaker(parsedDataToObject));
  const container2 = document.querySelector('.posts .list-group');
  const newList = parsedDataToObject.posts.map((post) => postsListMaker(post, i18Instance));
  container2.append(...newList);
};
