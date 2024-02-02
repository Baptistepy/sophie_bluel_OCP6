"use strict";

// ******************************* CONSTANTES *******************************

const emailElt = document.getElementById('email');
const passwordElt = document.getElementById('password');


const LOGIN_URL = 'http://localhost:5678/api/users/login';

// ******************************* VARIABLES *******************************


// ******************************* FONCTIONS *******************************

/**
 * Logs in a user by making a POST request to the LOGIN_URL with the provided data.
 *
 * @param {event} event - The event object triggered by the login action.
 */
  function loginUser() {
  fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "email": emailElt.value,
      "password": passwordElt.value
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.userId && data.token) {
        const token = data.token;
        const userId = data.userId;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        window.location.href = 'index.html';
      } else {
        alert("Erreur dans l'identifiant ou le mot de passe.");
      }
    })
    .catch(error => {
      console.error("Une erreur s'est produite lors de la requête:", error);
    });
}

// ******************************* CODE PRINCIPAL *******************************

document.getElementById("submit").addEventListener("click", (event) => {
  event.preventDefault();
  loginUser();
});

