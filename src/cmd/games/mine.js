import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';
import { RandInt } from 'pixlbot/utils/random.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

class Minesweeper
{
	constructor(rows, cols, mines)
	{
		this.rows = rows;
		this.cols = cols;
		this.mines = mines;
		this.grid = [];

		for (let y = 0; y < cols; ++y)
		{
			this.grid.push([]);
			for (let x = 0; x < rows; ++x)
				this.grid[y].push(0);
		}
	}

	Randomize()
	{
		let minesAssigned = 0;
		while (minesAssigned < this.mines)
		{
			let x = RandInt(this.cols);
			let y = RandInt(this.rows);

			if (this.grid[x][y] !== 9)
			{
				this.grid[x][y] = 9;
				++minesAssigned;
			}
		}

		for (let y = 0; y < this.rows; ++y)
			for (let x = 0; x < this.cols; ++x)
				if (this.grid[x][y] !== 9)
					this.grid[x][y] = this.GetAdjacentMines(x, y);
	}

	GetAdjacentMines(col, row)
	{
		let result = 0;

		for (let y = row > 0 ? row - 1 : row;
			y <= (row < this.rows - 1 ? row + 1 : row);
			++y)
		{
			for (let x = col > 0 ? col - 1 : col;
				x <= (col < this.cols - 1 ? col + 1 : col);
				++x)
			{
				if (this.grid[x][y] === 9)
					++result;
			}
		}

		return result;
	}

	Parse()
	{
		const map = [
			'zero',  'one',   'two',
			'three', 'four',  'five',
			'six',   'seven', 'eight',
			'boom'
		];

		let result = '';
		for (let y = 0; y < this.rows; ++y)
		{
			for (let x = 0; x < this.cols; ++x)
				result += `||:${map[this.grid[x][y]]}:||`
			result += '\n'
		}
		return result;
	}
}

export class Command extends BaseCommand
{
	description = 'Minesweeper';
	usage = '[<rows>] [<cols>] [<mines>]';

	OnMessage(msg, args)
	{
		for (let i = 0; i < 3; ++i)
			args[i] = parseInt(args[i]);

		let rows  = args[0] ? args[0] : cfg.games.minesweeper.rows;
		let cols  = args[1] ? args[1] : cfg.games.minesweeper.cols;
		let mines = args[2] ? args[2] : cfg.games.minesweeper.mines;

		if (rows <= 0 || cols <= 0 || mines <= 0)
			return 'All values must be greater than 0';

		if (mines > rows * cols)
			return 'Amount of mines must not be greater than total area';

		if (rows * cols > 99)
			return 'Total area must not be greater than 99';

		const minesweeper = new Minesweeper(rows, cols, mines);
		minesweeper.Randomize();

		const parsedData = minesweeper.Parse();
		const embed = DefaultEmbed(msg.author)
			.setTitle(`${minesweeper.cols}x${minesweeper.rows} - ${minesweeper.mines}`)
			.setDescription(parsedData);
		msg.channel.send({ embeds: [embed] });
	}
}
