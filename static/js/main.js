import {boardsManager} from "./controller/boardsManager.js";

function init() {
    boardsManager.loadBoards(userId);

    //manual sync
    const refreshButton = document.querySelector('#manual-sync');
    refreshButton.addEventListener('click', () => {
        boardsManager.reloadBoards(userId);
    });

    //auto sync
    const minute = 60000;
    setInterval(() => {
        boardsManager.reloadBoards(userId);
    }, minute);
}

init();
