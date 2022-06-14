import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {

            console.log(card)
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            //domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
            domManager.addChild(`.board-column-content[data-column-id="${card.status_id}"][data-board-id="${boardId}"]`, content)
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        }
    },
    createCard: async function (cardTitle, boardId, statusId) {
        await dataHandler.createNewCard(cardTitle, boardId, statusId);
        await this.loadCards(boardId);  // TODO load card or refresh page?
    },
};

function deleteButtonHandler(clickEvent) {
}
