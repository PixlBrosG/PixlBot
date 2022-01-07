const { Embed } = require('../API.js');

module.exports = {
	name: 'ping',
	class: 'utility',
	description: 'Pong!',
	usage: '',
	aliases: ['pong'],
	permissions: [],
	async execute(msg, args)
	{
		let embed = Embed(msg.author).setTitle(':ping_pong: **Pong!**');

		m = await msg.channel.send(embed);

		let ping = m.createdTimestamp - msg.createdTimestamp;
		m.edit(embed.setDescription(`${ping} ms`));
		console.log(`${ping} ms`);
	}
}
