import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import { stream, search } from 'play-dl';

import { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus  } from '@discordjs/voice';

/**
 * @typedef {import('discord.js').VoiceChannel} VoiceChannel
 * @typedef {import('discord.js').Guild} Guild
 * @typedef {import('discord.js').TextChannel} VoiceChannel
 * @typedef {import('discord.js').User} User
 * @typedef {import('@discordjs/voice').VoiceConnection} VoiceConnection
 * @typedef {import('@discordjs/voice').AudioPlayer} AudioPlayer
 * @typedef {import('play-dl').YouTubeVideo} YouTubeVideo
 */

export class Video
{
	/**
	 * @param {YouTubeVideo} info
	 * @param {User} requestor
	 */
	constructor(info, requestor)
	{
		this.title = info.title;
		this.url = info.url;
		this.thumbnailURL = info.thumbnails[0].url;
		this.durationRaw = info.durationRaw;
		this.requestor = {
			tag: requestor.tag,
			iconURL: requestor.displayAvatarURL()
		};
	}
}

class ServerQueue
{
	/** @type {TextChannel} */ textChannel;
	/** @type {VoiceConnection} */ connection;
	/** @type {AudioPlayer} */ audioPlayer;
	/** @type {boolean} */ replay;
	/** @type {Video[]} */ queue;

	/**
	 * @param {Guild} guild
	 * @param {VoiceChannel} voiceChannel
	 * @param {TextChannel} textChannel
	 */
	constructor(guild, voiceChannel, textChannel)
	{
		this.textChannel = textChannel;
		this.connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: guild.id,
			adapterCreator: guild.voiceAdapterCreator
		});
		this.audioPlayer = createAudioPlayer();
		this.replay = false;
		this.queue = [];
	}
}

export class MusicPlayer
{
	/** @type {Map<string, ServerQueue>} */
	queue;

	constructor()
	{
		this.queue = new Map();
	}

	/**
	 * @param {string} query
	 * @param {number} limit
	 * @returns {Promise<YouTubeVideo[]>}
	 */
	async Find(query, limit = 1)
	{
		return await search(query, { source: { youtube: "video" }, limit });
	}

	/**
	 * @param {Video} video
	 * @returns {string} Formatted video title with URL
	 */
	Parse(video)
	{
		return `[${video.title}](${video.url})`;
	}

	/**
	 * @param {Guild} guild
	 * @param {VoiceChannel} voiceChannel
	 * @param {TextChannel} textChannel
	 */
	JoinVoiceChannel(guild, voiceChannel, textChannel)
	{
		const serverQueue = new ServerQueue(guild, voiceChannel, textChannel);

		serverQueue.connection.subscribe(serverQueue.audioPlayer);
		this.queue.set(guild.id, serverQueue);
	}

	/**
	 * @param {string} guildID
	 */
	async Play(guildID)
	{
		if (!this.queue.has(guildID))
			return;

		const serverQueue = this.queue.get(guildID);
		const video = serverQueue.queue[0];

		if (!video)
		{
			setTimeout(() =>
			{
				if (this.queue.has(guildID) && serverQueue.queue.length > 0)
					return;

				serverQueue.connection.disconnect();
				serverQueue.connection.destroy(true);

				this.queue.delete(guildID);
			}, 30000);

			return;
		}

		const audioSource = await stream(video.url, { discordPlayerCompatibility: true });
		const audioResource = createAudioResource(audioSource.stream, { inputType: audioSource.inputType });

		serverQueue.audioPlayer.play(audioResource);

		let embed = DefaultEmbed(video.requestor)
			.setDescription(`:notes: Now playing ${this.Parse(video)}`)
			.setThumbnail(video.thumbnailURL);
		serverQueue.textChannel.send({ embeds: [embed] });

		serverQueue.audioPlayer.on(AudioPlayerStatus.Idle, () =>
		{
			if (serverQueue.replay)
				serverQueue.queue.push(video);
			serverQueue.queue.shift();
			this.Play(guildID);
		});
	}

	/**
	 * @param {Guild} guild
	 * @param {Video} video
	 * @param {VoiceChannel} voiceChannel
	 * @param {TextChannel} textChannel
	 */
	Add(guild, video, voiceChannel, textChannel)
	{
		if (!this.queue.has(guild.id))
			this.JoinVoiceChannel(guild, voiceChannel, textChannel);

		const serverQueue = this.queue.get(guild.id);

		serverQueue.queue.push(video);
		const embed = DefaultEmbed(video.requestor)
			.setDescription(`Added ${this.Parse(video)} to queue!`)
			.setThumbnail(video.thumbnailURL);
		textChannel.send({ embeds: [embed] });

		if (serverQueue.queue.length === 1)
			this.Play(guild.id);
	}
}
