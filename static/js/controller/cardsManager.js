import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {socket} from "../main.js";
import {flashes, flashList, showPopup} from "../popup.js";

export let cardsManager = {
    loadCards: async function (boardId, archived = false) {
        let cards;
        if (archived === true) {
            cards = await dataHandler.getArchivedCardsByBoardId(userId, boardId);
        } else {
            cards = await dataHandler.getCardsByBoardId(userId, boardId);
        }
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-column-content[data-column-id="${card.status_id}"][data-board-id="${boardId}"]`, content)
            if (card.user_id === userId) {
                domManager.addEventListener(
                    `.card-remove[data-card-id="${card.id}"]`,
                    "click",
                    deleteButtonHandler
                );
                domManager.addEventListener(
                    `.card-archive[data-card-id="${card.id}"]`,
                    "click",
                    archiveButtonHandler
                );
                domManager.addEventListener(
                    `.card-title[data-card-board-id="${card.board_id}"][data-card-id="${card.id}"]`,
                    "click",
                    event => {
                        renameCardTitle(event, card);
                    }
                );
            }
            initDragAndDrop(boardId, cards);
        }
    },
    createCard: function (cardTitle, boardId, statusId) {
        dataHandler.createNewCard(cardTitle, boardId, statusId, userId)
            .then(response => {
                flashList.innerHTML = '';
                flashList.innerHTML = `<li>${response.message}</li>`;
                showPopup(flashes);
            })
            .catch(err => console.log(err));
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.remove());
        this.loadCards(boardId)
            .then(() => {
                socket.send('a');
            })
            .catch(err => console.log(err));
    },
};

function archiveButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.cardBoardId;
    const cardId = clickEvent.target.dataset.cardId;
    if (confirm('Are you sure want to archive/unarchive that card?')) {
        dataHandler.archiveCard(boardId, cardId, userId)
            .then(response => {
                flashList.innerHTML = '';
                flashList.innerHTML = `<li>${response.message}</li>`;
                showPopup(flashes);
            })
            .catch(err => console.log(err));
        socket.send('a');
    }
}

function deleteButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.cardBoardId;
    const cardId = clickEvent.target.dataset.cardId;
    if (confirm('Are you sure want to delete that card?')) {
        dataHandler.deleteCard(boardId, cardId, userId)
            .then(response => {
                flashList.innerHTML = '';
                flashList.innerHTML = `<li>${response.message}</li>`;
                showPopup(flashes);
            })
            .catch(err => console.log(err));
        socket.send('a');
    }
}

const saveNewCardTitle = (submitEvent, event, card, newTitle, newTitleForm) => {
    submitEvent.preventDefault();
    event.target.innerText = newTitle.value;
    newTitleForm.outerHTML = event.target.outerHTML;
    dataHandler.renameCard(card.board_id, card.id, newTitle.value, userId)
        .then(response => {
            flashList.innerHTML = '';
            flashList.innerHTML = `<li>${response.message}</li>`;
            showPopup(flashes);
        })
        .catch(err => console.log(err));
    newTitleForm.reset();
    domManager.addEventListener(
        `.card-title[data-card-board-id="${card.board_id}"][data-card-id="${card.id}"]`,
        "click",
        event => {
            renameCardTitle(event, card);
        }
    );
};

function renameCardTitle(event, card) {
    const title = event.target.innerText;
    event.target.outerHTML = `<form id="new-card-title-form" style="display: inline-block;" class="card-title"><input type="text" id="new-card-title" value="${title}"><button type="submit">save</button></form>`;
    const newTitleForm = document.querySelector('#new-card-title-form');
    const newTitle = document.querySelector('#new-card-title');
    newTitle.focus();
    newTitleForm.addEventListener('submit', submitEvent => {
        saveNewCardTitle(submitEvent, event, card, newTitle, newTitleForm);
        socket.send('a');
    });
    newTitleForm.addEventListener('focusout', submitEvent => {
        saveNewCardTitle(submitEvent, event, card, newTitle, newTitleForm);
        socket.send('a');
    });
}

function initDragAndDrop(boardId, cardsFromDB) {
    let current = null;
    let cards = document.querySelectorAll(`.card[data-card-board-id="${boardId}"]`);
    for (let card of cards) {
        card.ondragstart = (e) => {
            current = card;
            console.log(current);
            card.classList.add("dragged");
        };
        card.ondragend = () => {
            card.classList.remove("dragged");
            current = null;
        };
        card.ondragenter = () => {
            if (card !== current) {
                card.classList.add("drop-zone");
            }
        };
        card.ondragover = (e) => {
            e.preventDefault();
        }
        card.ondragleave = () => {
            if (card !== current) {
                card.classList.remove("drop-zone");
            }
        };
        card.ondrop = (e) => {
            e.preventDefault();
            if (card !== current) {
                let [currentStatus, currentOrder] = get_card_status_and_order(current.dataset.cardId, cardsFromDB);
                let [dropStatus, dropOrder] = get_card_status_and_order(card.dataset.cardId, cardsFromDB);
                if (currentStatus === dropStatus && currentOrder < dropOrder) {
                    card.parentElement.insertBefore(current, card.nextSibling);
                    update_cards(cardsFromDB,)

                } else {
                    card.parentElement.insertBefore(current, card);
                }
            }
        };
    }
}

function get_card_status_and_order(card_id, cards) {
    for (let card of cards) {
        if (card.id == card_id) {
            return [card.status_id, card.card_order];
        }
    }
}