const { songQueue, Embed } = require('../API.js');

module.exports = {
	name: 'remove',
	class: 'music',
	description: 'Remove song from song queue',
	usage: '<index>',
	aliases: [],
	permissions: [],

	execute(msg, args)
	{
		if (!msg.member.voice.channel)
			return msg.channel.send(Embed(msg.author).setDescription("You must be in a voice channel to execute this command!"));

		if (args.length == 0 || isNaN(parseInt(args[0])))
			return msg.channel.send(Embed(msg.author).setDescription("Invalid index"));

		let index = parseInt(args[0]);

		if (songQueue.get(msg.guild.id).songs.length <= index || index <= 0)
			return msg.channel.send(Embed(msg.author).setDescription("Index out of range!"))

		let queue = songQueue.get(msg.guild.id);
		msg.channel.send(Embed(msg.author).setDescription(`Removed ${queue.songs[index].title}`));
		queue.songs.splice(index, 1);
	}
}
