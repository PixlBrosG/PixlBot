// Uses youtube instead of spotify

export const name = 'play';
export const category = 'music';
export const description = 'Play music';
export const usage = '<query|URL>';
export const aliases = ['p'];
export const permissions = [];

import { video_basic_info, stream, search, yt_validate } from 'play-dl';
import { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource } from "@discordjs/voice";

import { ParseVideo, Embed } from '../API.js';
import { songQueue } from '../index.js';

async function VideoFinder(query)
{
	let result = await search(query, { source: { "youtube": "video" } });
	return result[0] ? result[0] : null;
}

async function VideoPlayer(guildId)
{
	if (!songQueue.has(guildId)) return;
	const queue = songQueue.get(guildId);

	const song = queue.songs[0];
	if (!song)
	{
		queue.connection.disconnect();
		queue.connection.destroy();
		songQueue.delete(guildId);
		return;
	}

	const source = await stream(song.url, { discordPlayerCompatibility: true });
	const resource = createAudioResource(source.stream, { inputType: source.inputType });

	queue.audioPlayer.play(resource);

	let embed = Embed(song.addedBy)
		.setDescription(`:notes: Now playing ${ParseVideo(song)}`)
		.setThumbnail(song.thumbnailURL);
	queue.textChannel.send({ embeds: [embed] });
}

export async function execute(msg, args)
{
	let voiceChannel = msg.member.voice.channel;
	
	if (!voiceChannel)
		return 'You need to be in a voice channel to execute this command';
	if (!args[0])
		return 'Please specify a song';
	
	let queue = songQueue.get(msg.guild.id);
	let song = {};

	if (args[0].startsWith('https') && yt_validate(args[0]) === 'video')
	{
		let info = (await video_basic_info(args[0])).video_details;

		song = {
			title: info.title,
			url: info.url,
			thumbnailURL: info.thumbnails[0].url,
			length: info.durationRaw,
			addedBy: {
				tag: msg.author.tag,
				iconURL: msg.author.displayAvatarURL()
			}
		};
	}
	else
	{
		let video = await VideoFinder(args.join(' '));

		if (!video)
			return 'Error while finding video!';

		song = {
			title: video.title,
			url: video.url,
			thumbnailURL: video.thumbnails[0].url,
			length: video.durationRaw,
			addedBy: {
				tag: msg.author.tag,
				iconURL: msg.author.displayAvatarURL()
			}
		}
	}

	let embed = Embed(msg.author).setDescription(`Added ${ParseVideo(song)} to queue!`)
		.setThumbnail(song.thumbnailURL);
	msg.channel.send({ embeds: [embed] });

	if (queue)
	{
		queue.songs.push(song);
		return;
	}

	let serverQueue = {
		textChannel: msg.channel,
		connection: joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: msg.guild.id,
			adapterCreator: msg.guild.voiceAdapterCreator
		}),
		audioPlayer: createAudioPlayer(),
		replay: false,
		songs: [song]
	}

	serverQueue.connection.subscribe(serverQueue.audioPlayer);
	songQueue.set(msg.guild.id, serverQueue);

	VideoPlayer(msg.guild.id);

	serverQueue.audioPlayer.on(AudioPlayerStatus.Idle, () =>
	{
		if (serverQueue.replay)
			serverQueue.songs.push(song);
		serverQueue.songs.shift();
		VideoPlayer(msg.guild.id);
	});

	serverQueue.audioPlayer.on(AudioPlayerStatus.AutoPaused, () =>
	{
		serverQueue.connection.disconnect();
		serverQueue.connection.destroy();
		songQueue.delete(guildId);
	});
}
