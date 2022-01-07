const { songQueue, Embed } = require('../API.js');

module.exports = {
	name: 'replay',
	class: 'music',
	description: 'Replay',
	usage: '',
	aliases: [],
	permissions: [],
	execute(msg, args)
	{
		let queue = songQueue.get(msg.guild.id);
		queue.replay = !queue.replay;
		msg.channel.send(Embed(msg.author).setDescription(`:repeat: Replay: ${queue.replay ? '✅' : '❌'}`));
	}
}
