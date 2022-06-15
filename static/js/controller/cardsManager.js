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
                `.card[data-card-id="${card.id}"]`,
                "dragstart",
                dragStartHandler
            )
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "dragend",
                dragEndHandler
            )
        }
    },
    createCard: async function (cardTitle, boardId, statusId) {
        await dataHandler.createNewCard(cardTitle, boardId, statusId);
        location.reload();
    },
};

function deleteButtonHandler(clickEvent) {
}

function dragStartHandler(){

}

function dragStartHandler(){

}