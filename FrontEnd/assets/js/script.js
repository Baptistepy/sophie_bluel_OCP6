"use strict";

// ******************************* CONSTANTES *******************************

const API_URL = 'http://localhost:5678/api';

const gallery           = document.querySelector('.gallery');

const btns                = document.querySelectorAll('.btn'); 

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
function createWork(work) {
  const figure      = document.createElement('figure');
  const img         = document.createElement('img');
  const figcaption  = document.createElement('figcaption');

  img.src                 = work.imageUrl;
  img.alt                 = work.imageAlt;
  figcaption.textContent  = work.caption;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);


}

/**
 * Creates all works.
 */
function createAllWorks() {
  works.forEach(work => { createWork(work) });
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

    function checkConnection() {
      return localStorage.getItem("token") ? true : false;
    }

    function logout() {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }

    function displayAdmin() {
      if (checkConnection()) {
        const login       = document.querySelector('#login');
        const filters     = document.querySelector('#filters');
        const adminLine   = document.querySelector('.black-band');
        const modifModal  = document.querySelector('.projet-title');
        const modifBtn    = document.querySelector('.modif-modal');

        login.innerHTML = "<button>logout</button>";
        login.addEventListener("click", logout);

        filters.style.display = "none";
        adminLine.style.display = "flex";
        modifBtn.style.display = "inline-block";

        modifModal.insertAdjacentElement("afterend", modifBtn );
        
      }
    }

// ******************************* CODE PRINCIPAL *******************************

displayAdmin();

getWorks()
  .then(() => {
    createAllWorks();
    addFilteredListeners();
  }) 
  .catch(error => {
    console.error(error);
  })



