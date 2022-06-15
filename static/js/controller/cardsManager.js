import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.board-column-content[data-column-id="${card.status_id}"][data-board-id="${boardId}"]`, content)
            domManager.addEventListener(
                `.card-remove[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
            domManager.addEventListener(
                `.card-title[data-card-board-id="${card.board_id}"][data-card-id="${card.id}"]`,
                "click",
                event => {
                    const title = event.target.innerText;
                    event.target.outerHTML = `<form id="new-card-title-form" style="display: inline-block;" class="card-title"><input type="text" id="new-card-title" value="${title}"><button type="submit">save</button></form>`;
                    const newTitleForm = document.querySelector('#new-card-title-form');
                    const newTitle = document.querySelector('#new-card-title');
                    newTitleForm.addEventListener('submit', submitEvent => {
                        submitEvent.preventDefault();
                        event.target.innerText = newTitle.value;
                        newTitleForm.outerHTML = event.target.outerHTML;
                        dataHandler.renameCard(card.board_id, card.id, newTitle.value)
                        newTitleForm.reset();
                        location.reload();
                    });
                }
            )
        }
    },
    createCard: async function (cardTitle, boardId, statusId) {
        await dataHandler.createNewCard(cardTitle, boardId, statusId);
        location.reload();
    },
};

function deleteButtonHandler(clickEvent) {
    let boardId
    if (clickEvent.target.parentElement.parentElement.hasAttribute('data-board-id')) {
        boardId = clickEvent.target.parentElement.parentElement.dataset.boardId;
    } else {
        boardId = clickEvent.target.parentElement.parentElement.parentElement.dataset.boardId;
    }
    const cardId = clickEvent.target.parentElement.dataset.cardId;
    if (confirm('Are you sure want to delete that card?')) {
        dataHandler.deleteCard(boardId, cardId);
    }
    location.reload();
}
document.query