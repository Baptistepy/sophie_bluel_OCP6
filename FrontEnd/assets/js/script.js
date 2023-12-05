"use strict";

// ******************************* CONSTANTES *******************************

const API_URL = 'http://localhost:5678/api';

const gallery           = document.querySelector('.gallery');



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

  } catch (error) {
    console.error(error);
  }
}

async function filterElements(categories) {

  }

  /**
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
  **/
  function btnElement() {
    const btns = document.querySelectorAll('.btn');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(btn => btn.classList.remove('btn_active'));
        btn.classList.add('btn_active');
    });
    }
  );
  }

// ******************************* CODE PRINCIPAL *******************************

getWorks()
  .then(() => {
    filterElements();
    createAllWorks();
  }) 
  .catch(error => {
    console.error(error);
  })

  btnElement();

