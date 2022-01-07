const { RandInt, Embed } = require('../API.js');

module.exports = {
	name: 'coinflip',
	class: 'games',
	description: 'Flip a coin',
	usage: '',
	aliases: ['cf'],
	permissions: [],
	execute(msg, _args)
	{
		let result = RandInt(0, 2) == 1 ? "Heads" : "Tails";
		msg.channel.send(Embed(msg.author).setDescription(`:coin: **${result}**`));
	}
}
