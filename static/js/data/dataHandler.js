export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
        return await apiGet(`/api/boards/${boardId}`);
    },
    getStatuses: async function () {
        return await apiGet(`/api/statuses`)
    },
    getStatus: async function (statusId) {
        return await apiGet(`/api/statuses/${statusId}`)
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        return await apiPost(`/api/boards`, {"boardTitle": boardTitle})
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
        return await apiPost(`/api/boards/${boardId}/cards`, {"cardTitle": cardTitle, "statusId": statusId});
    },
    renameBoard: async function (boardId, boardTitle) {
        return await apiPatch(`/api/boards/${boardId}`, {"boardTitle": boardTitle});
    },
    deleteCard: async function (boardId, cardId) {
        return await apiDelete(`/api/boards/${boardId}/cards/${cardId}`);
    },
    deleteBoard: async function (boardId) {
        // creates new board, saves it and calls the callback function with its data
        return await apiDelete(`/api/boards/${boardId}`)
    },
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiDelete(url) {
    let response = await fetch(url, {
        method: "DELETE",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPut(url) {
}

async function apiPatch(url, payload) {
    let response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        return await response.json();
    }
}
