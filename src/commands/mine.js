export const name = 'mine';
export const category = 'games';
export const description = 'Minesweeper';
export const usage = '[<rows>] [<cols>] [<mines>]';
export const aliases = [];
export const permissions = [];

import cfg from '../config.json' assert { type: 'json' };
import { RandInt } from '../API.js';

function GetAdjacentCells(row, col, table)
{
	let result = 0;

	for (let y = col > 0 ? col - 1 : col;
		y <= (col < table.length - 1 ? col + 1 : col);
		++y)
	{
		for (let x = row > 0 ? row - 1 : row;
			x <= (row < table[0].length - 1 ? row + 1 : row);
			++x)
		{
			if (table[y][x] == 9)
				++result;
		}
	}

	return result;
}

function Parse(table)
{
	const map = [
		'zero',  'one',   'two',
		'three', 'four',  'five',
		'six',   'seven', 'eight',
		'boom'
	];

	let result = '';
	for (let y = 0; y < table.length; ++y)
	{
		for (let x = 0; x < table[0].length; ++x)
			result += `||:${map[table[y][x]]}:||`
		result += '\n'
	}
	return result;
}

export function execute(_, args)
{
	for (let i = 0; i < 3; ++i)
		args[i] = parseInt(args[i]);

	let rows  = args[0] ? args[0] : cfg.games.minesweeper.rows;
	let cols  = args[1] ? args[1] : cfg.games.minesweeper.cols;
	let mines = args[2] ? args[2] : cfg.games.minesweeper.mines;

	if (mines > rows * cols)
		return 'Amount of mines must not be greater than total area';

	if (rows * cols > 99)
		return 'Total area must not be greater than 99';

	if (rows <= 0 || cols <= 0 || mines <= 0)
		return 'All values must be greater than 0';

	let ms = [];

	for (let y = 0; y < cols; ++y)
	{
		ms.push([]);
		for (let x = 0; x < rows; ++x)
			ms[y].push(0);
	}

	let minesAssigned = 0;
	while (minesAssigned < mines)
	{
		let x = RandInt(rows);
		let y = RandInt(cols);

		if (ms[y][x] != 9)
		{
			ms[y][x] = 9;
			++minesAssigned;
		}
	}

	for (let y = 0; y < cols; ++y)
		for (let x = 0; x < rows; ++x)
			if (ms[y][x] != 9)
				ms[y][x]  = GetAdjacentCells(x, y, ms);

	return Parse(ms);
}
