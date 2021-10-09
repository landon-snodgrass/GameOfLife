class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // static utilities
    static North = {
        x: 0,
        y: -1,
    }

    static NorthEast = {
        x: 1,
        y: -1,
    }

    static East = {
        x: 1,
        y: 0,
    }

    static SouthEast = {
        x: 1,
        y: 1,
    }

    static South = {
        x: 0,
        y: 1,
    }

    static SouthWest = {
        x: -1,
        y: 1,
    }

    static West = {
        x: -1,
        y: 0,
    }

    static NorthWest = {
        x: -1,
        y: -1,
    }

    static Directions = [this.North, this.NorthEast, this.East, this.SouthEast, this.South, this.SouthWest, this.West, this.NorthWest];
}

class Cell {
    constructor(pos, gameBoard) {
        this.alive = Math.round(Math.random()) == 1 ? true : false;

        // TODO: This seems kind garbage-y
        const _class = this.alive ? "alive" : "dead";
        //this.template = `<div class="cell ${_class}"></div>`;

        this.position = pos;
        this.gameBoard = gameBoard;
        this.element = document.createElement('div');
        this.element.style.top = this.position.y * 8 + "px";
        this.element.style.left = this.position.x * 8 + "px";

        // TODO: Again, pretty garbage-y
        this.element.classList.add("cell", _class);
    }

    aliveClass() {
        return this.alive ? "alive" : "dead";
    }

    update() {
        const neighbors = this.gameBoard.getNeighbors(this.position);
        let aliveNeighbors = 0;
        neighbors.forEach((cell) => {
            if (cell.isAlive()) {
                aliveNeighbors++;
            }
        });

        if (aliveNeighbors < 2) {
            this.die();
        } else if (aliveNeighbors == 3) {
            this.resurrect();
        } else if (aliveNeighbors > 3) {
            this.die();
        }
    }

    die() {
        this.alive = false;
        this.element.classList.remove('alive');
        this.element.classList.add('dead');
    }

    resurrect() {
        if (this.alive == false) {
            this.alive = true;
            this.element.classList.remove('dead');
            this.element.classList.add('alive');
        }
    }

    isAlive() {
        return this.alive;
    }
}

class Game {
    constructor(sizeX, sizeY) {
        this.gameBoard = [];
        this.gameLoop = null;
        this.gameBoardElement = document.getElementById('game-board');
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }

    // 75 x 75 currently
    initGameBoard() {
        for (let x = 0; x < this.sizeX; x++) {
            // TODO: This next line seems weird too but it wouldn't work otherwise because the first D of my 2D
            // array was undefined
            this.gameBoard[x] = [];
            for (let y = 0; y < this.sizeY; y++) {
                const pos = new Position(x, y);
                this.gameBoard[x][y] = new Cell(pos, this);
                this.gameBoardElement.appendChild(this.gameBoard[x][y].element);
            }
        }
    }

    getNeighbors(position) {
        let neighbors = [];
        Position.Directions.forEach((direction) => {
            const neighbor = new Position(position.x + direction.x, position.y + direction.y);
            if (this.isInBounds(neighbor)) {
                neighbors.push(this.gameBoard[neighbor.x][neighbor.y]);
            }
        });
        return neighbors;
    }

    isInBounds(position) {
        return position.x > 0 && position.x < this.sizeX && position.y > 0 && position.y < this.sizeY;
    }

    start(fps) {
        this.initGameBoard(75, 75);
        const mfps = 1000 / fps;
        this.gameLoop = setInterval(() => {
            this.update();
        }, mfps)
    }

    stop() {
        clearInterval(this.gameLoop);
        this.clearBoard();
    }

    clearBoard() {
        for (let x = 0; x < 75; x++) {
            for (let y = 0; y < 75; y++) {
                this.gameBoard[x][y].element.remove();
                this.gameBoard[x][y] = null;
            }
        }
    }

    update() {
        for (let x = 0; x < 75; x++) {
            for (let y = 0; y < 75; y++) {
                this.gameBoard[x][y].update();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let game = null;
    document.getElementById('start').addEventListener('click', () => {
        game = new Game(75, 75);
        game.start(2);
    });
    document.getElementById('end').addEventListener('click', () => {
        if (game != null) {
            game.stop();
        }
    });
})