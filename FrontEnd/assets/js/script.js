"use strict";

// ******************************* CONSTANTES *******************************

const apiUrl = 'http://localhost:5678/api/works';

const figures = document.querySelectorAll('figure');

// ******************************* VARIABLES *******************************
// ******************************* FONCTIONS *******************************


// ******************************* CODE PRINCIPAL *******************************

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        data.forEach(project => {
            const figure = document.createElement('figure');

            const img = document.createElement('img');

            img.src = project.imageUrl; 
            img.alt = project.imageAlt; 

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = project.caption; 

            figure.appendChild(img);

            figure.appendChild(figcaption);

            const parentElement = document.querySelector('.gallery');
            parentElement.appendChild(figure);
        });
    })
