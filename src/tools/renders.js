/* eslint-disable no-unused-expressions */
const postsRender = (data, elements, i18Instance, viewedPostsIds) => {
  const list = data.map((post) => {
    const listElement = document.createElement('li');
    const aElement = document.createElement('a');
    const button = document.createElement('button');
    listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    viewedPostsIds.includes(post.id) ? aElement.classList.add('fw-normal', 'link-secondary') : aElement.classList.add('fw-bold');
    aElement.href = post.url;
    aElement.id = post.id;
    aElement.textContent = post.title;
    aElement.rel = 'noopener noreferrer';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.type = 'button';
    button.id = post.id;
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18Instance.t('buttons.description_window');
    listElement.append(aElement);
    listElement.append(button);
    return listElement;
  });
  elements.postsContainer.replaceChildren(...list);
};

const feedsRender = (feeds, elements) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const header = document.createElement('h3');
  header.classList.add('h6', 'm-0');
  feeds.map((feed) => {
    header.textContent = feed.title;
    const paragraph = document.createElement('p');
    paragraph.classList.add('m-0', 'small', 'text-black-50');
    paragraph.textContent = feed.description;
    li.append(header, paragraph);
    return elements.feedsContainer.append(li);
  });
};
export default { postsRender, feedsRender };
