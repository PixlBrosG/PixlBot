const { Embed, RandInt } = require('../API.js');

module.exports = {
	name: 'choose',
	class: 'commands',
	description: 'Vælg',
	usage: '<...>',
	aliases: [],
	permissions: [],
	execute(msg, args)
	{
		msg.channel.send(Embed(msg.author)
			.setTitle('I chooose...')
			.setDescription(args[RandInt(0, args.length)])
		);
	}
}
