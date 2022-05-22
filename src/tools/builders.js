export const modalWindowBuilder = (elements, normalizedData, i18Instance) => {
  const { modalHeader, modalBody } = elements.modalWindowElements;
  const { closeModal, fullArticle } = elements.modalWindowElements.modalControl;
  const modalList = document.querySelectorAll('[data-bs-toggle="modal"]');
  const closeArticleWindowButton = fullArticle.nextElementSibling;
  fullArticle.textContent = i18Instance.t('buttons.open_article');
  closeArticleWindowButton.textContent = i18Instance.t('buttons.close_article');
  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-backdrop', 'fade', 'show');
  modalList.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { target } = e;
      fullArticle.href = target.previousElementSibling.href;
      const postId = target.dataset.id;
      const elementData = normalizedData.posts.find((element) => element.dataId === postId);
      const desription = elementData.description;
      modalBody.textContent = desription;
      const header = target.previousElementSibling.textContent;
      modalHeader.textContent = header;
      const id = button.dataset.bsTarget;
      const modalElement = document.querySelector(id);
      modalElement.classList.add('show');
      modalElement.style = 'display:block';
      document.body.append(modalWindow);
      closeModal.forEach((element) => {
        element.addEventListener('click', () => {
          modalElement.classList.remove('show');
          modalElement.style = 'display:none';
          modalWindow.remove();
        });
      });
    });
  });
};

const postsListBuilder = (element, i18Instance, dataId) => {
  const listElement = document.createElement('li');
  const aElement = document.createElement('a');
  const button = document.createElement('button');
  listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  aElement.classList.add('fw-bold');
  aElement.href = element.link;
  aElement.textContent = element.title;
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
};

const feedsListBuilder = (data) => {
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

export const buildFeedsAndPosts = (responce, i18Instance) => {
  const container1 = document.querySelector('.feeds .list-group');
  container1.append(feedsListBuilder(responce));
  const container2 = document.querySelector('.posts .list-group');
  const newList = responce.posts.map((post) => postsListBuilder(
    post,
    i18Instance,
    post.dataId,
  ));
  container2.append(...newList);
};
