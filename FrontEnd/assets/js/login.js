"use strict";

// ******************************* CONSTANTES *******************************

const emailElt = document.getElementById('email');
const passwordElt = document.getElementById('password');

const data = {
  "email": "sophie.bluel@test.tld",
  "password": "S0phie"
};

const LOGIN_URL = 'http://localhost:5678/api/users/login';

// ******************************* VARIABLES *******************************


// ******************************* FONCTIONS *******************************

function loginUser(event) {
  event.preventDefault();
  fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
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

document.getElementById('login').addEventListener('submit', function (event) {
  loginUser(event);
});
