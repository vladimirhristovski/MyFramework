export function makeInitialState() {
    return {
        board: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ],
        player: 'X',
        draw: false,
        winner: null,
    }
}

export function markReducer(state, {row, col}) {
    if (row > 3 || row < 0 || col > 3 || col < 0) {
        throw new Error('Invalid move')
    }

    if (state.board[row][col]) {
        throw new Error('Invalid move')
    }

    const newBoard = [
        [...state.board[0]],
        [...state.board[1]],
        [...state.board[2]],
    ]
    newBoard[row][col] = state.player

    const newPlayer = state.player === 'X' ? 'O' : 'X'
    const winner = checkWinner(newBoard, state.player)
    const draw = !winner && newBoard.every((row) => row.every((cell) => cell))

    return {
        board: newBoard,
        player: newPlayer,
        draw,
        winner,
    }
}

function checkWinner(board, player) {
    for (let i = 0; i < 3; i++) {
        if (checkRow(board, i, player)) {
            return player
        }

        if (checkColumn(board, i, player)) {
            return player
        }
    }

    if (checkMainDiagonal(board, player)) {
        return player
    }

    if (checkSecondaryDiagonal(board, player)) {
        return player
    }

    return null
}

function checkRow(board, idx, player) {
    const row = board[idx]
    return row.every((cell) => cell === player)
}

function checkColumn(board, idx, player) {
    const column = [board[0][idx], board[1][idx], board[2][idx]]
    return column.every((cell) => cell === player)
}

function checkMainDiagonal(board, player) {
    const diagonal = [board[0][0], board[1][1], board[2][2]]
    return diagonal.every((cell) => cell === player)
}

function checkSecondaryDiagonal(board, player) {
    const diagonal = [board[0][2], board[1][1], board[2][0]]
    return diagonal.every((cell) => cell === player)
}