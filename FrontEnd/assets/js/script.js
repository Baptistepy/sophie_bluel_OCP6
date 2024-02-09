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

// ******************************* WORKS AND FILTERS *******************************

/**
 * Creates a new element and appends it to the gallery.
 *
 * @param {Object} work - The work object containing the necessary information.
 * @param {string} work.imageUrl - The URL of the image to be displayed.
 * @param {string} work.imageAlt - The alternate text for the image.
 * @param {string} work.caption - The caption for the image.
 */
function createModalWork(work, container) {
  const trashGallery = document.querySelectorAll('.gallery i.fa-trash-can')
  const figure            = document.createElement('figure');
  const img               = document.createElement('img');
  const figcaption        = document.createElement('figcaption');
  const deleteBtn         = document.createElement("i");

  trashGallery.forEach((trash) => trash.remove());

  img.src = work.imageUrl;
  img.alt = work.imageAlt;
  figcaption.textContent = work.caption;

  deleteBtn.classList.add("delete-btn", "fa-solid", "fa-trash-can", "fa-xs");
  deleteBtn.id = "trash-" + work.id;

  figure.appendChild(deleteBtn);
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
  container.appendChild(figure);

  deleteBtn.addEventListener('click', () => deleteModal(work.id));

}

function createWork(work) {
  const figure      = document.createElement('figure');
  const img         = document.createElement('img');
  const figcaption  = document.createElement('figcaption');

  img.src = work.imageUrl;
  img.alt = work.imageAlt;
  figcaption.textContent = work.caption;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);

}

/**
 * Creates all works.
 */
function createAllWorks(container) {
  console.log(works);
  if (container) {
    container.innerHTML = '';
    works.forEach(work => { createModalWork(work, container) });
  } else {
    gallery.innerHTML = '';
    works.forEach(work => { createWork(work) });
  }
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
function filterElements(id,) {
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
      btns.forEach(btn => btn.classList.remove('btn-active'));
      btn.classList.add('btn-active');
    });
  }
  );
}

// ******************************* ADMIN *******************************

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


// ******************************* FIRST MODAL *******************************


/**
 * Function to display a modal with a photo gallery and buttons for adding and returning.
 */
function displayModal() {

  const header        = document.createElement("header");
  const modal         = document.createElement("section");
  const title         = document.createElement("h2");
  const footer        = document.createElement("footer");
  const closeBtn      = document.createElement("span");
  const returnBtn     = document.createElement("span");
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


// ******************************* SECOND MODAL *******************************


/**
 * An asynchronous function that creates a modal for adding photos.
 *
 * @param {Object} modalGallery - the DOM element for the modal gallery
 * @param {Object} addBtn - the button element for adding photos
 * @param {string} title - the title for the modal
 * @param {Object} returnBtn - the button element for returning to the previous page
 * @return {Promise} a Promise that resolves when the modal is created
 */
async function createModal(modalGallery, addBtn, title, returnBtn) {
  modalGallery.innerHTML = "";
  addBtn.innerText = "Valider";
  title.innerText = "Ajout photo";

  const form            = document.createElement('form');
  const addPhoto        = document.createElement('div');
  const imgBtn          = document.createElement('span');
  const photoInput      = document.createElement('input');
  const photoOutput     = document.createElement('output');
  const photoBtn        = document.createElement('label');
  const textPhoto       = document.createElement('p');
  const titreForm       = document.createElement('input');
  const titreLabel      = document.createElement('label');
  const categorieForm   = document.createElement('select');
  const categorieLabel  = document.createElement('label');
  const options         = await getCategories();

  returnBtn.classList.remove("hidden");
  form.classList.add('form-modal');
  form.setAttribute('enctype', 'multipart/form-data');
  form.id = 'form-modal';
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
    optionElement.value = option.id;
    optionElement.innerText = option.name;
    categorieForm.appendChild(optionElement);
  })

  photoInput.id = 'photo';
  photoBtn.setAttribute('for', 'photo');
  photoInput.type = 'file';
  photoInput.required = true;

  photoOutput.id = 'preview';

  photoBtn.type = 'file';
  photoBtn.innerText = '+ Ajouter Photo';

  titreLabel.innerText = 'Titre';
  titreLabel.for = 'titreForm';

  categorieLabel.innerText = 'Catégorie';
  categorieLabel.for = 'categorieForm';

  titreForm.type = 'text';
  titreForm.id = 'titre';
  titreForm.required = true;

  categorieForm.id = 'category';
  categorieForm.required = true;

  addBtn.id = 'btn-input';
  addBtn.disabled = true;
  addBtn.classList.add('btn-disabled');

  modalGallery.style.marginBottom = '40px';

  addPhoto.appendChild(photoInput);
  addPhoto.appendChild(photoOutput);
  addPhoto.appendChild(imgBtn);
  addPhoto.appendChild(photoBtn);
  addPhoto.appendChild(textPhoto);

  form.appendChild(addPhoto);
  form.appendChild(titreLabel);
  form.appendChild(titreForm);
  form.appendChild(categorieLabel);
  form.appendChild(categorieForm);

  modalGallery.appendChild(form);
  document.getElementById('photo').addEventListener('change', handleFileSelect);
  addBtn.addEventListener('click', () => {
    addProject(titreForm, categorieForm, photoInput);
  })

  titreForm.addEventListener('input', inputListener);
  categorieForm.addEventListener('input', inputListener);
  photoInput.addEventListener('input', inputListener);
}

function inputListener() {
  const titreForm = document.getElementById('titre');
  const categorieForm = document.getElementById('category');
  const photoInput = document.getElementById('photo');
  const addBtn = document.getElementById('btn-input');
  
  if (titreForm.value !== '' && categorieForm.value !== '' && photoInput.value !== '') {
    addBtn.disabled = false;
    addBtn.classList.remove('btn-disabled');
  } else {
    addBtn.disabled = true;
    addBtn.classList.add('btn-disabled');
  }
}

// ******************************* ADD PROJECT *******************************


/**
 * Handles the file selection event, processes the selected files, and updates the UI accordingly.
 *
 * @param {Event} evt - the event object representing the file selection
 */
function handleFileSelect(evt) {
  const files       = evt.target.files;
  const photoInput  = document.getElementById('photo');
  const photoBtn    = document.querySelector('.photo-label');
  const textPhoto   = document.querySelector('.text-photo');
  
  for (var i = 0, f; f = files[i]; i++) {
    if (!f.type.match('image.*')) {
      continue;
    }
    if (f.size >4194304) { 
      alert("L'image est trop volumineuse. Veuillez sélectionner une image plus petite.");
      continue;
    }
    const reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        const span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('preview').insertBefore(span, null);
      };
    })(f);
    reader.readAsDataURL(f);
  }
    photoInput.style.display = "none";
    photoBtn.style.display = "none";
    textPhoto.style.display = "none";
  }

/**
 * Adds a new project with the provided title, category, and image.
 *
 * @param {HTMLInputElement} titreForm - input element for the project title
 * @param {HTMLSelectElement} categoryForm - select element for the project category
 * @param {HTMLInputElement} photoInput - input element for the project image
 */
async function addProject(titreForm, categoryForm, photoInput,) {

try {
  const formData = new FormData();
  formData.append('title', titreForm.value);
  formData.append('category', categoryForm.value);
  formData.append('image', photoInput.files[0]);

  const response = await fetch('http://localhost:5678/api/works', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  if (response.ok) {
    getWorks()
    .then(() => {
      closeModal();
      removeModalBlur();
      createAllWorks(gallery);
    })
    .catch(error => {
      console.error(error);
    })    
  } else {
    alert('L\'identifiant ne correspond à aucune ressource');
  }
}
  catch (error) {
  console.error(error);
}
}

// ******************************* CLOSE/DELETE MODAL *******************************


/**
 * Closes the modal and removes the "modal-open" class from the body.
 */
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
  
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log(response);
    if (response.ok) {
      getWorks()
      .then(() => {
        closeModal();
        removeModalBlur();
        createAllWorks(gallery);
      })
      .catch(error => {
        console.error(error);
      })    
    } else {
      alert('L\'identifiant ne correspond à aucune ressource');
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Handles the file selection event, processes the selected files, and updates the DOM accordingly.
 *
 * @param {Event} evt - the file selection event
 */

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




