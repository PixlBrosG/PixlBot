const { Minesweeper, Parse, GetData } = require('../games/minesweeper.js');
const { Embed } = require('../API.js');

module.exports = {
	name: 'mine',
	class: 'games',
	description: 'Minesweeper',
	usage: '[rows] [cols] [mines]',
	aliases: [],
	permissions: [],
	async execute(msg, args)
	{
		try
		{
			for (let i = 0; i < 3; i++)
				args[i] = parseInt(args[i]);

			let ms = Minesweeper(
				!isNaN(args[0]) ? args[0] : undefined,
				!isNaN(args[1]) ? args[1] : undefined,
				!isNaN(args[2]) ? args[2] : undefined
			);

			msg.channel.send(Embed(msg.author).setDescription(Parse(ms)));
			console.log(GetData(ms));
		}
		catch (err)
		{
			msg.channel.send(Embed(msg.author).setDescription(err));
			console.error(err);
		}
	}
}