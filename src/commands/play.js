const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const { ParseTime, Embed, songQueue } = require('../API.js');

async function VideoFinder(query) {
	const result = await ytSearch(query);
	return result.videos.length > 0 ? result.videos[0] : null;
}

module.exports = {
	name: 'play',
	class: 'music',
	description: 'Play music',
	usage: '<query|url>',
	aliases: ['p'],
	permissions: [],

	async videoPlayer(guildId, song) {
		const queue = songQueue.get(guildId);

		if (!song) {
			queue.voiceChannel.leave();
			songQueue.delete(guildId);
			return;
		}

		const stream = ytdl(song.url, { filter: 'audioonly' });
		queue.connection.play(stream, { seek: 0, volume: 1 })
		.on('finish', () => {
			if (!queue.replay) queue.songs.shift();
			module.exports.videoPlayer(guildId, queue.songs[0]);
		});
		queue.textChannel.send(Embed().setDescription(`:notes: Now playing \`${song.title}\``));
	},

	async execute(msg, args) {
		const embed = Embed(msg.author);
		const voiceChannel = msg.member.voice.channel;

		if (!voiceChannel) return msg.channel.send(embed.setDescription("You need to be in a voice channel to execute this command"));
		if (!args[0]) return msg.channel.send(embed.setDescription("Please specify a song"));

		const queue = songQueue.get(msg.guild.id);
		let song = {};

		if (ytdl.validateURL(args[0])) {
			const songInfo = await ytdl.getInfo(args[0]);
			song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
				length: ParseTime(songInfo.videoDetails.lengthSeconds)
			};
		} else {
			const video = await VideoFinder(args.join(' '));
			if (video) {
				song = {
					title: video.title,
					url: video.url,
					length: video.timestamp
				};
			} else {
				msg.channel.send(embed.setDescription("Error finding video!"));
			}
		}

		if (!queue) {
			const queueConstructor = {
				voiceChannel: voiceChannel,
				textChannel: msg.channel,
				connection: null,
				replay: false,
				songs: []
			};

			songQueue.set(msg.guild.id, queueConstructor);
			queueConstructor.songs.push(song);

			try {
				queueConstructor.connection = await voiceChannel.join();
				msg.channel.send(embed.setDescription(`Added \`${song.title}\` to queue!`));
				module.exports.videoPlayer(msg.guild.id, queueConstructor.songs[0]);
			} catch (err) {
				songQueue.delete(msg.guild.id);
				msg.channel.send(embed.setDescription('There was an error connecting!'));
				throw err;
			}
		} else {
			queue.songs.push(song);
			msg.channel.send(embed.setDescription(`Added \`${song.title}\` to queue!`));
		}
	}
}