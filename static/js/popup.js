const loginPopup = document.querySelector('#login-popup');
const loginButton = document.querySelector('#login-button');
const loginForm = document.querySelector('#login');
const usernameLogin = document.querySelector('#username-login');
const passwordLogin = document.querySelector('#password-login');

const registerPopup = document.querySelector('#register-popup');
const registerButton = document.querySelector('#register-button');
const registerForm = document.querySelector('#register');
const usernameRegister = document.querySelector('#username-register');
const passwordRegister = document.querySelector('#password-register');
const passwordRegister2 = document.querySelector('#password2-register');

const createCardPopup = document.querySelector('#create-card');
const createCardForm = document.querySelector('#create-card-form');
const createCardTitle = document.querySelector('#card-title');
const createCardStatus = document.querySelector('#card-status');
import {cardsManager} from "./controller/cardsManager.js";

const popUps = document.querySelectorAll('.popup');
const form = document.querySelectorAll('.form');

export const showPopup = element => {
    element.classList.add('fade-in');
    element.classList.remove('fade-out');
    element.style.display = 'flex';
}

const closePopup = element => {
    element.classList.remove('fade-in');
    element.style.display = 'none';
}

loginButton.addEventListener('click', () => {
    showPopup(loginPopup);
})

registerButton.addEventListener('click', () => {
    showPopup(registerPopup);
})

popUps.forEach(popUp => {
    popUp.addEventListener('click', () => {
        popUp.classList.remove('fade-in')
        popUp.classList.add('fade-out')
        setTimeout(() => {
            closePopup(popUp);
        }, 400);
    });
})

form.forEach(item => {
    item.addEventListener('click', event => {
        event.stopPropagation();
    });
});

loginForm.addEventListener('submit', event => {
    event.preventDefault();

    const urlTarget = `${window.location.href}login`;

    const userData = {
        username: usernameLogin.value,
        password: passwordLogin.value
    };

    fetch(urlTarget, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData),
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = data['url'];
        })
        .catch(error => console.error(error));

    loginForm.reset();
    closePopup(loginPopup);
});

registerForm.addEventListener('submit', event => {
    event.preventDefault();

    const urlTarget = `${window.location.href}register`;

    const userData = {
        username: usernameRegister.value,
        password: passwordRegister.value,
        password2: passwordRegister2.value
    };

    fetch(urlTarget, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData),
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = data['url'];
        })
        .catch(error => console.error(error));

    registerForm.reset();
    closePopup(registerPopup);
});

createCardForm.addEventListener('submit', event => {
    event.preventDefault();

    const cardTitle = createCardTitle.value;
    const cardStatus = createCardStatus.value;
    const boardId = localStorage.getItem('boardId');
    localStorage.removeItem('boardId');

    console.log(cardTitle);
    console.log(cardStatus);
    console.log(boardId);
    cardsManager.createCard(cardTitle, boardId, cardStatus);

    createCardForm.reset();
    closePopup(createCardPopup);
});
