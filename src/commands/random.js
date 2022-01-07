const { RandInt, Embed } = require('../API.js');

module.exports = {
	name: 'random',
	class: 'commands',
	description: 'random integer from <min> to <max>',
	usage: '(<min> <max>)|<max>',
	aliases: [],
	permissions: [],
	execute(msg, args)
	{
		let min = 0, max = 10;

		if (args[1])
		{
			if (parseInt(args[0]))
				min = parseInt(args[0]);
			else
				return msg.channel.send(Embed(msg.author).setDescription('<min> should be an integer'));

			if (parseInt(args[1]))
				max = parseInt(args[1]);
			else
				return msg.channel.send(Embed(msg.author).setDescription('<max> should be an integer'));
		}
		else
		{
			if (parseInt(args[0]))
				max = parseInt(args[0]);
			else
				return msg.channel.send(Embed(msg.author).setDescription('<max> should be an integer'));
		}


		msg.channel.send(Embed(msg.author)
			.setTitle(`Random(${min}, ${max})`)
			.setDescription(RandInt(min, max))
		);
	}
}
