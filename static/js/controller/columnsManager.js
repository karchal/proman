import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { boardsManager } from "./boardsManager.js";

export let columnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getStatuses(boardId);
        for (let column in columns) {
            column = columns[column];
            const columnBuilder = htmlFactory(htmlTemplates.column);
            const content = columnBuilder(column, boardId);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"]`,
                "dragenter",
                dragEnterHandler
            )
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"]`,
                "dragover",
                dragOverHandler
            )
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"]`,
                "dragover",
                dragLeaveHandler
            )
            domManager.addEventListener(
                `.board-columns[data-board-id="${boardId}"]`,
                "drop",
                dropHandler
            )
        }
    },
    createColumn: async function (columnTitle, boardId) {
        await dataHandler.createColumn(boardId, columnTitle);
        await boardsManager.reloadBoards(userId);
    },
}

function dragEnterHandler(dragEnterEvent) {
    dragEnterEvent.target.classList.add("drop-zone")
}
function dragOverHandler(dragOverEvent) {
}
function dragLeaveHandler(dragLeaveEvent) {
    dragLeaveEvent.target.classList.remove("drop-zone")
}
function dropHandler(dragLeaveEvent) {
}