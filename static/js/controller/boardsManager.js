import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild(".board-container", content);
            domManager.addEventListener(
                `.board-toggle[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
    // loadBoard: async function (board_id) {
    //     const board = await dataHandler.getBoard(board_id);
    //     const boardBuilder = htmlFactory(htmlTemplates.board);
    //     const content = boardBuilder(board);
    //     domManager.addChild(".board-container", content);
    //     domManager.addEventListener(
    //         `.toggle-board-button[data-board-id="${board.id}"]`,
    //         "click",
    //         showHideButtonHandler
    //     );
    // },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    console.log(boardId);
    cardsManager.loadCards(boardId);
}
