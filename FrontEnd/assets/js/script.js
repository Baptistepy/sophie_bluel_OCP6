"use strict";

// ******************************* CONSTANTES *******************************

const API_URL = 'http://localhost:5678/api';

const gallery = document.querySelector('.gallery');

const btns = document.querySelectorAll('.btn');

const portfolio = document.querySelector('#portfolio');
// ******************************* VARIABLES *******************************

let works = [];
let categories = [];

// ******************************* FONCTIONS *******************************

/**
 * Creates a new element and appends it to the gallery.
 *
 * @param {Object} work - The work object containing the necessary information.
 * @param {string} work.imageUrl - The URL of the image to be displayed.
 * @param {string} work.imageAlt - The alternate text for the image.
 * @param {string} work.caption - The caption for the image.
 */
function createWork(work, container) {
  const figure      = document.createElement('figure');
  const img         = document.createElement('img');
  const figcaption  = document.createElement('figcaption');

  img.src = work.imageUrl;
  img.alt = work.imageAlt;
  figcaption.textContent = work.caption;

  if (container !== gallery) {
    const deleteBtn = document.createElement("i");

    deleteBtn.classList.add("delete-btn", "fa-solid", "fa-trash-can", "fa-xs");

    deleteBtn.id = "trash-" + work.id;

    figure.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', () => deleteModal(work.id));
  }

  figure.appendChild(img);
  figure.appendChild(figcaption);
  container.appendChild(figure);

}

/**
 * Creates all works.
 */
function createAllWorks(container) {
  works.forEach(work => { createWork(work, container) });
}

/**
 * Retrieves elements from the API and creates an element for each project.
 */
async function getWorks() {
  try {
    const response = await fetch(API_URL + '/works');
    works = await response.json();

  } catch (error) {
    console.error(error);
  }
}

/**
 * Retrieves the categories from the API.
 *
 * @return {Promise<void>} - A promise that resolves when the categories are successfully retrieved.
 */
async function getCategories() {
  try {
    const response = await fetch(API_URL + '/categories');
    categories = await response.json();
    return categories;

  } catch (error) {
    console.error(error);
  }
}

/**
 * Filters the elements based on the given ID.
 *
 * @param {number} id - The ID used to filter the elements.
 */
function filterElements(id) {
  gallery.innerHTML = '';

  if (id === 0) createAllWorks();

  for (const work of works) {
    if (work.category.id === id) createWork(work);
  }
}

/**
 * Adds event listeners to a collection of buttons and filters elements based on the clicked button.
 *
 * @param {number} btnId - The ID of the button that was clicked.
 */
function addFilteredListeners() {
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterElements(parseInt(btn.id));
      btns.forEach(btn => btn.classList.remove('btn_active'));
      btn.classList.add('btn_active');
    });
  }
  );
}

/**
 * Check the connection by retrieving the token from local storage.
 *
 * @return {boolean} True if the token exists in local storage, false otherwise.
 */
function checkConnection() {
  return localStorage.getItem("token") ? true : false;
}

/**
 * Logout the user by removing the token from local storage
 * and redirecting to the index page.
 */
function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/**
 * Displays the admin interface if the user is connected.
 */
function displayAdmin() {
  if (checkConnection()) {
    const login          = document.querySelector('#login');
    const filters        = document.querySelector('#filters');
    const adminLine      = document.querySelector('.black-band');
    const modifModal     = document.querySelector('.projet-title');
    const modifBtn       = document.querySelector('.modif-modal');

    login.innerHTML = "<button>logout</button>";
    login.addEventListener("click", logout);

    filters.style.display = "none";
    adminLine.style.display = "flex";
    modifBtn.style.display = "block";

    modifBtn.addEventListener("click", function() {
      displayModal();
      applyModalBlur();
    });
    modifModal.insertAdjacentElement("afterend", modifBtn);
  }
}

function applyModalBlur() {
  const body = document.querySelector('body');
  const backgroundOverlay = document.createElement('div');

  backgroundOverlay.classList.add('background-overlay');
  body.appendChild(backgroundOverlay);
}

function removeModalBlur() {
  const body = document.querySelector('body');
  const backgroundOverlay = document.querySelector('.background-overlay');
  body.removeChild(backgroundOverlay);
}

function createModal(modalGallery, addBtn, title, returnBtn) {
  modalGallery.innerHTML = "";
  addBtn.type = "submit";
  addBtn.innerText = "Valider";
  title.innerText = "Ajout photo";

  const form            = document.createElement('form');
  const addPhoto        = document.createElement('div');
  const imgBtn          = document.createElement('span');
  const photoInput      = document.createElement('input');
  const photoBtn        = document.createElement('button');
  const textPhoto       = document.createElement('p');
  const titreForm       = document.createElement('input');
  const titreLabel      = document.createElement('label');
  const categorieForm   = document.createElement('select');
  const categorieLabel  = document.createElement('label');
  const options         = ["Appartements", "Objets", "Hôtels & restaurants"];

  returnBtn.classList.remove("hidden");
  form.classList.add('form-modal');
  addPhoto.classList.add('add-photo');
  photoInput.classList.add('photo-btn');
  textPhoto.innerHTML = "jpg, png : 4mo max";
  textPhoto.classList.add('text-photo');
  imgBtn.classList.add('fa-regular', 'fa-image', 'fa-5x', 'image-preview');
  photoBtn.classList.add('photo-label', 'file-input-button');
  titreForm.classList.add('text-input');
  categorieForm.classList.add('text-input');

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.innerText = option;
    categorieForm.appendChild(optionElement);
  })

  photoInput.type = 'file';
  photoInput.required = true;

  photoBtn.type = 'file';
  photoBtn.innerText = '+ Ajouter Photo';

  titreLabel.innerText = 'Titre';
  titreLabel.for = 'titreForm';

  categorieLabel.innerText = 'Catégorie';
  categorieLabel.for = 'categorieForm';

  titreForm.type = 'text';
  titreForm.name = 'imageUrl';
  titreForm.required = true;

  categorieForm.id = 'category';
  categorieForm.name = 'category';
  categorieForm.required = true;

  modalGallery.style.marginBottom = '40px';

  form.appendChild(addPhoto);
  form.appendChild(photoInput);
  form.appendChild(photoBtn);
  form.appendChild(titreLabel);
  form.appendChild(titreForm);
  form.appendChild(categorieLabel);
  form.appendChild(categorieForm);

  modalGallery.appendChild(form);

  addPhoto.appendChild(photoInput);
  addPhoto.appendChild(photoBtn);
  addPhoto.appendChild(imgBtn);
  addPhoto.appendChild(textPhoto);
}

function displayModal() {

  const header        = document.createElement("header");
  const modal         = document.createElement("section");
  const title         = document.createElement("h2");
  const footer        = document.createElement("footer");
  const closeBtn      = document.createElement("span");
  const returnBtn      = document.createElement("span");
  const addBtn        = document.createElement("button");
  const modalBorder   = document.createElement("div");
  const modalGallery  = document.createElement("section");


  modal.classList.add("modal");
  returnBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  returnBtn.classList.add("return", "hidden");
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  closeBtn.classList.add("close");
  title.innerText = "Galerie Photo";
  addBtn.innerText = "Ajouter une Photo";
  addBtn.classList.add("btn-active");
  addBtn.classList.add("btn");
  modalBorder.classList.add("modal-border");
  modalGallery.classList.add("modal-gallery");
  
  createAllWorks(modalGallery);

  addBtn.addEventListener('click', () => {
    createModal(modalGallery, addBtn, title, returnBtn);
  })

  returnBtn.addEventListener('click', displayModal);
  closeBtn.addEventListener('click', function() {
    closeModal();
    removeModalBlur();
  });

  portfolio.appendChild(modal);
  modal.appendChild(header);
  header.appendChild(returnBtn);
  header.appendChild(closeBtn);
  modal.appendChild(title);
  modal.appendChild(modalGallery);
  footer.appendChild(addBtn);
  footer.appendChild(modalBorder);
  modal.appendChild(footer);
}

function closeModal() {
  const modal = document.querySelector('.modal');
  const body  = document.querySelector("body");
  modal.remove();
  body.classList.remove("modal-open");
}

/**
 * Deletes a modal with the specified ID.
 *
 * @param {number} id - The ID of the modal to delete.
 * @return {Promise<void>} A promise that resolves when the modal is successfully deleted.
 */
async function deleteModal(id) {
  console.log(localStorage.getItem('token'));
  await fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    })
    .then(response => {
      if (response.ok) {
        createAllWorks(gallery);
      } else {
        console.log('Une erreur s\'est produite lors de la suppression de la ressource.');
      }
    })
    .catch(error => {
      console.log('Une erreur s\'est produite lors de la suppression de la ressource :', error);
    });
}
// ******************************* CODE PRINCIPAL *******************************

displayAdmin();

getWorks()
  .then(() => {
    createAllWorks(gallery);
    addFilteredListeners();
  })
  .catch(error => {
    console.error(error);
  })




