const { Embed } = require('../API.js');

module.exports = {
	name: 'reverse',
	class: 'commands',
	description: 'Reverse some message',
	usage: '<string>',
	aliases: [],
	permissions: [],
	execute(msg, args)
	{
		if (args.length == 0) return msg.channel.send(Embed(msg.author).setDescription('!esrever ot agassem a yficepS'));
		msg.channel.send(Embed(msg.author).setDescription(args.join(' ').split('').reverse().join('')));
	}
}
