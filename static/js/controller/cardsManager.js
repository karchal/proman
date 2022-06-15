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
        }
    },
    createCard: async function (cardTitle, boardId, statusId) {
        await dataHandler.createNewCard(cardTitle, boardId, statusId, userId);
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
        dataHandler.deleteCard(boardId, cardId, userId);
    }
    location.reload();
}
