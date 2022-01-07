const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const { ParseTime, ParseVideo, Embed, songQueue } = require('../API.js');

async function VideoFinder(query) {
	const result = await ytSearch(query);
	return result.videos.length > 0 ? result.videos[0] : null;
}

function videoPlayer(guildId, song)
{
	let queue = songQueue.get(guildId);

	if (!song)
	{
		queue.voiceChannel.leave();
		songQueue.delete(guildId);
		return;
	}

	let stream = ytdl(song.url, { filter: 'audioonly' });
	queue.connection.play(stream, { seek: 0, volume: 1 })
	.on('finish', () =>
	{
		if (queue.replay)
			queue.songs.push(queue.songs[0]);
		queue.songs.shift();
		videoPlayer(guildId, queue.songs[0]);
	});

	queue.textChannel.send(Embed(song.added_by)
		.setDescription(`:notes: Now playing ${ParseVideo(song)}`)
		.setThumbnail(song.thumbnail_url));
}

module.exports = {
	name: 'play',
	class: 'music',
	description: 'Play music',
	usage: '<query|link>',
	aliases: ['p'],
	permissions: [],

	async execute(msg, args)
	{
		let embed = Embed(msg.author);
		let voiceChannel = msg.member.voice.channel;

		if (!voiceChannel) return msg.channel.send(embed.setDescription("You need to be in a voice channel to execute this command"));
		if (!args[0]) return msg.channel.send(embed.setDescription("Please specify a song"));

		let queue = songQueue.get(msg.guild.id);
		let song = {};

		if (ytdl.validateURL(args[0]))
		{
			let info = await ytdl.getInfo(args[0]);
			song = {
				title: info.videoDetails.title,
				url: info.videoDetails.video_url,
				thumbnail_url: info.thumbnail_url,
				length: ParseTime(info.videoDetails.lengthSeconds),
				added_by: msg.author
			};
		}
		else
		{
			let video = await VideoFinder(args.join(' '));

			if (video)
			{
				song = {
					title: video.title,
					url: video.url,
					thumbnail_url: video.thumbnail,
					length: video.timestamp,
					added_by: msg.author
				};
			}
			else
			{
				msg.channel.send(embed.setDescription("Error finding video!"));
			}
		}

		if (!queue)
		{
			try
			{
				songQueue.set(msg.guild.id, {
					voiceChannel: voiceChannel,
					textChannel: msg.channel,
					connection: await voiceChannel.join(),
					replay: false,
					songs: [song]
				});

				msg.channel.send(embed.
					setDescription(`Added ${ParseVideo(song)} to queue!`)
					.setThumbnail(song.thumbnail_url));
				videoPlayer(msg.guild.id, song);
			}
			catch (err)
			{
				msg.channel.send(embed.setDescription('Error connecting to voice channel!'));
				console.error(err);
			}
		}
		else
		{
			queue.songs.push(song);
			msg.channel.send(embed
				.setDescription(`Added ${ParseVideo(song)} to queue!`)
				.setThumbnail(song.thumbnail_url));
		}
	}
}
