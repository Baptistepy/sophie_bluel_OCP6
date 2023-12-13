"use strict";

// ******************************* CONSTANTES *******************************

const submit = document.getElementById("submit");
const email = document.getElementById("email");
const password = document.getElementById("password");

const user = {
    email: email.value,
    password: password.value,
}

const url = "http://localhost:5678/api/user/login";

// ******************************* VARIABLES *******************************


// ******************************* FONCTIONS *******************************


// ******************************* CODE PRINCIPAL *******************************
