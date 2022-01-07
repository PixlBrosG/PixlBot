const { Embed } = require('../API.js');

module.exports = {
	name: 'clear',
	class: 'utility',
	description: 'Clear messages from the current channel',
	usage: '<amount>',
	aliases: [],
	permissions: ['MANAGE_MESSAGES'],
	async execute (msg, args)
	{
		await msg.delete();

		let amount = parseInt(args[0]) > 100 ? 100 : parseInt(args[0]);
		if (isNaN(amount)) return msg.channel.send(Embed(msg.author).setDescription('Amount should be an integer'));
		if (amount < 0) return msg.channel.send(Embed(msg.author).setDescription('Amount should be 0 or more'));

		try
		{
			msg.channel.bulkDelete(amount, true);
		}
		catch (err) { }
	}
}
