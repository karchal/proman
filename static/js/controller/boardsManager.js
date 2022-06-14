import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {showPopup} from "../popup.js";
import {columnsManager} from "./columnsManager.js";

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
            domManager.addEventListener(
                `.board-add[data-board-id="${board.id}"]`,
                "click",
                () => {
                    const createCardPopup = document.querySelector('#create-card');
                    localStorage.setItem('boardId', board.id);
                    showPopup(createCardPopup);
                }
            );
            domManager.addEventListener(
                `.board-title[data-board-id="${board.id}"]`,
                "click",
                event => {
                    const title = event.target.innerText;
                    const titleElement = document.cloneNode(event.target);
                    event.target.outerHTML = `<form id="new-title-form" style="display: inline-block;" class="board-title"><input type="text" id="new-title" value="${title}"><button type="submit">save</button></form>`;
                    const newTitleForm = document.querySelector('#new-title-form');
                    const newTitle = document.querySelector('#new-title');
                    newTitleForm.addEventListener('submit', submitEvent => {
                        submitEvent.preventDefault();
                        console.log('New Title:', newTitle.value);
                        console.log('event.target.outerHTML', event.target.outerHTML);
                        event.target.innerText = newTitle.value;
                        newTitleForm.outerHTML = event.target.outerHTML;
                        console.log('event.target', event.target);
                        dataHandler.renameBoard(board.id, newTitle.value)
                        newTitleForm.reset();
                        location.reload();
                    });
                }
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
    let target = clickEvent.target;
    let boardId = target.dataset.boardId;
    if (boardId === undefined) {
        boardId = target.parentElement.dataset.boardId;
    }
    columnsManager.loadColumns(boardId);
    cardsManager.loadCards(boardId);
}
