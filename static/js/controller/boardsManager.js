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
            if (board.public || !board.public && board.user_id === userId) {
                const boardBuilder = htmlFactory(htmlTemplates.board);
                const content = boardBuilder(board);
                domManager.addChild(".board-container", content);
                domManager.addEventListener(
                    `.board-toggle[data-board-id="${board.id}"]`,
                    "click",
                    showHideButtonHandler,
                    //true
                );
            }
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
                    event.target.outerHTML = `<form id="new-title-form" style="display: inline-block;" class="board-title"><input type="text" id="new-title" value="${title}"><button type="submit">save</button></form>`;
                    const newTitleForm = document.querySelector('#new-title-form');
                    const newTitle = document.querySelector('#new-title');
                    newTitleForm.addEventListener('submit', submitEvent => {
                        submitEvent.preventDefault();
                        event.target.innerText = newTitle.value;
                        newTitleForm.outerHTML = event.target.outerHTML;
                        dataHandler.renameBoard(board.id, newTitle.value, userId);
                        newTitleForm.reset();
                        location.reload();
                    });
                }
            );
            domManager.addEventListener(`.fas.fa-trash-alt.board[data-board-id="${board.id}"]`,
                "click",
                event => {
                if (confirm("Are you sure you want to delete this board?")) {
                    dataHandler.deleteBoard(board.id, userId)
                     location.reload();
                } else {
                    alert('Operation aborted!')
                }
                })
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    if (domManager.hasChild(`.board-columns[data-board-id="${boardId}"]`)) {
        domManager.removeAllChildren(`.board-columns[data-board-id="${boardId}"]`);
    } else {
        loadBoardContent(boardId);
    }
    domManager.toggleCSSClasses(`.fas[data-board-id="${boardId}"]`, 'fa-chevron-down', 'fa-chevron-up');
}

async function loadBoardContent(boardId){
    await columnsManager.loadColumns(boardId);
    cardsManager.loadCards(boardId);
}
