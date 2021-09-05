const config = require('../config.json').games.minesweeper;
const { RandInt } = require("../API.js");

function GetAdjacentCells(row, col, table) {
    let result = 0;

    for (
        let y = col > 0 ? col - 1 : col;
        y <= (col < table.length - 1 ? col + 1 : col);
        y++
    ) {
        for (
            let x = row > 0 ? row - 1 : row;
            x <= (row < table[0].length - 1 ? row + 1 : row);
            x++
        ) {
            if (table[y][x] == 9)
                result++;
        }
    }
    return result;
}

module.exports = {
    Minesweeper(
        rows = config.rows,
        cols = config.cols,
        mines = config.mines
    ) {
        if (mines > rows * cols) throw "Error: Amount of mines must not be greated than total area";
        if (rows * cols > 99) throw "Error: Total area must not be greater than 99";
        if (rows <= 0 || cols <= 0 || mines <= 0) throw "Error: All values must be greater than 0"

        let ms = [];

        for (let y = 0; y < cols; y++) {
            ms.push([]);
            for (let x = 0; x < rows; x++)
                ms[y].push(0);
        }

        let minesAssigned = 0;
        while (minesAssigned < mines) {
            const y = RandInt(0, cols);
            const x = RandInt(0, rows);
            if (ms[y][x] != 9) {
                ms[y][x]  = 9;
                minesAssigned++;
            }
        }

        for (let y = 0; y < cols; y++) {
            for (let x = 0; x < rows; x++) {
                if (ms[y][x] != 9)
                    ms[y][x]  = GetAdjacentCells(x, y, ms);
            }
        }
        return ms;
    },

    Parse(table, reveal = false) {
        const map = [
            "zero",  "one",   "two",
            "three", "four",  "five",
            "six",   "seven", "eight",
            "boom"
        ];
        let result = "";
        reveal = reveal ? "" : "||";

        for (let y = 0; y < table.length; y++) {
            for (let x = 0; x < table[0].length; x++)
                result += `${reveal}:${map[table[y][x]]}:${reveal}`;
            result += '\n';
        }
        return result;
    },

    GetData(table) {
        let data = {
            rows: table[0].length,
            cols: table.length,
            mines: []
        };

        for (let y = 0; y < table.length; y++) {
            for (let x = 0; x < table[0].length; x++) {
                if (table[y][x] == 9) {
                    data.mines.push([x, y]);
                }
            }
        }
        return data;
    }
}