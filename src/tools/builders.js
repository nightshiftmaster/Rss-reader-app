export const modalWindowBuilder = (elements, normalizedData, i18Instance) => {
  const { modalHeader, modalBody } = elements.modalWindowElements;
  const { closeModal, fullArticle } = elements.modalWindowElements.modalControl;
  const modalElementsList = document.querySelectorAll('[data-bs-toggle="modal"]');
  const closeArticleWindowButton = fullArticle.nextElementSibling;
  fullArticle.textContent = i18Instance.t('buttons.open_article');
  closeArticleWindowButton.textContent = i18Instance.t('buttons.close_article');
  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-backdrop', 'fade', 'show');
  modalElementsList.forEach((button) => {
    button.addEventListener('click', (e) => {
      const { target } = e;
      fullArticle.href = target.previousElementSibling.href;
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

export const postsListBuilder = (elements, i18Instance) => {
  const container = document.querySelector('.posts .list-group');
  const list = elements.posts.map((post) => {
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
  container.append(...list);
};

export const feedsListBuilder = (data) => {
  const container1 = document.querySelector('.feeds .list-group');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'border-0', 'border-end-0');
  const header = document.createElement('h3');
  header.classList.add('h6', 'm-0');
  header.textContent = data.title;
  const paragraph = document.createElement('p');
  paragraph.classList.add('m-0', 'small', 'text-black-50');
  paragraph.textContent = data.description;
  li.append(header, paragraph);
  container1.append(li);
  return container1;
};
