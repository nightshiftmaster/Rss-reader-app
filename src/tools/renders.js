/* eslint-disable no-param-reassign */
const closeModalWindow = (elements, modalElement, modalWindow) => {
  const { closeModal } = elements.modalWindowElements.modalControl;
  closeModal.forEach((element) => {
    element.addEventListener('click', () => {
      modalElement.classList.remove('show');
      modalElement.style = 'display:none';
      modalWindow.remove();
    });
  });
};

const modalWindowRender = (elements, normalizedData, i18Instance) => {
  const { modalHeader, modalBody } = elements.modalWindowElements;
  const { fullArticle } = elements.modalWindowElements.modalControl;
  const modalElementsList = document.querySelectorAll('[data-bs-toggle="modal"]');
  const closeArticleWindowButton = fullArticle.nextElementSibling;
  fullArticle.textContent = i18Instance.t('buttons.open_article');
  closeArticleWindowButton.textContent = i18Instance.t('buttons.close_article');
  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-backdrop', 'fade', 'show');
  modalElementsList.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { target } = e;
      const targetElement = target.previousElementSibling;
      targetElement.classList.remove('fw-bold');
      targetElement.classList.add('fw-normal', 'link-secondary');
      fullArticle.href = targetElement.href;
      const postId = target.dataset.id;
      const elementData = normalizedData.posts.find((element) => element.dataId === postId);
      if (elementData === undefined) {
        return;
      }
      const desription = elementData.description;
      modalBody.textContent = desription;
      const header = target.previousElementSibling.textContent;
      modalHeader.textContent = header;
      const id = button.dataset.bsTarget;
      const modalElement = document.querySelector(id);
      modalElement.classList.add('show');
      modalElement.style = 'display:block';
      document.body.append(modalWindow);
      closeModalWindow(elements, modalElement, modalWindow);
    });
  });
};

const postsRender = (normalizedData, elements, i18Instance) => {
  const { postsList } = elements.containers.posts;
  const list = normalizedData.posts.map((post) => {
    const { dataId } = post;
    const listElement = document.createElement('li');
    const aElement = document.createElement('a');
    const button = document.createElement('button');
    listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    aElement.classList.add('fw-bold');
    aElement.href = post.link;
    aElement.textContent = post.title;
    aElement.rel = 'noopener noreferrer';
    aElement.dataset.id = dataId;
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.type = 'button';
    button.dataset.id = dataId;
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18Instance.t('buttons.description_window');
    listElement.append(aElement);
    listElement.append(button);
    return listElement;
  });
  postsList.append(...list);
};

const feedsRender = (normalizeData, elements) => {
  const { feedsList } = elements.containers.feeds;
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const header = document.createElement('h3');
  header.classList.add('h6', 'm-0');
  header.textContent = normalizeData.title;
  const paragraph = document.createElement('p');
  paragraph.classList.add('m-0', 'small', 'text-black-50');
  paragraph.textContent = normalizeData.description;
  li.append(header, paragraph);
  feedsList.append(li);
};

export default { modalWindowRender, postsRender, feedsRender };
