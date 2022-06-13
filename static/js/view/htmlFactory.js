export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<section class="board">
                <div class="board-header" data-board-id=${board.id}>
                    <span class="board-title">${board.title}</span>
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle" data-board-id="${board.id}">
                        <i class="fas fa-chevron-down"></i>
                   </button>
                </div>
                <div class="board-columns">
                    <div class="board-column">
                        <div class="board-column-title">New</div>
                        <div class="board-column-content"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">In Progress</div>
                        <div class="board-column-content"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Testing</div>
                        <div class="board-column-content"></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Done</div>
                        <div class="board-column-content"></div>
                    </div>
                </div>
            </section>`
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                ${card.title}
            </div>;`
}
