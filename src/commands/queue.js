const { songQueue, Embed, ParseVideo } = require('../API.js');

module.exports = {
	name: 'queue',
	class: 'music',
	description: 'Song queue',
	usage: '',
	aliases: ['q'],
	permissions: [],

	execute(msg, _args)
	{
		let embed = Embed(msg.author);
		let serverQueue = songQueue.get(msg.guild.id);

		if (!serverQueue) return msg.channel.send(embed.setDescription('Server queue is empty!'));

		let songs = '';

		if (serverQueue.songs.length > 1)
		{
			songs = '\n\n';
			for (let i = 1; i < serverQueue.songs.length; ++i)
				songs += `\`${i}\` ${ParseVideo(serverQueue.songs[i])} \`${serverQueue.songs[i].length}\`\n`;
		}

		msg.channel.send(embed
			.setTitle(`Music queue (${serverQueue.songs.length - 1} tracks)`)
			.setDescription(`**Now playing**:\n${ParseVideo(serverQueue.songs[0])} \`${serverQueue.songs[0].length}\`${songs}`)
			.setThumbnail(serverQueue.songs[0].thumbnail_url)
			.setFooter(`${embed.footer.text} - Replay: ${serverQueue.replay ? '✅' : '❌'}`, embed.footer.iconURL)
		);
	}
}
