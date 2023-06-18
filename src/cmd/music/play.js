import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';
import { Video } from 'pixlbot/main/music.js';

import { yt_validate } from 'play-dl';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class Command extends BaseCommand
{
	description = 'Play music';
	usage = '<query|URL>';
	aliases = ['p'];

	/**
	 * @param {Message} msg
	 * @param {string[]} args
	 * @returns {Promise<string>}
	 */
	async OnMessage(msg, args)
	{
		const voiceChannel = msg.member.voice.channel;
		if (!voiceChannel)
			return 'You need to be in a voice channel to play music';

		if (args.length === 0)
			return 'Please specify a query or URL to play';

		let video = {};

		if (args[0].startsWith('https') && yt_validate(args[0]) === 'video')
		{
			const info = video_basic_info(args[0]);
			video = new Video(info, msg.author);
		}
		else
		{
			video = (await bot.musicPlayer.Find(args.join(' ')))[0];
			if (!video)
				return `No videos found with the query '${args.join(' ')}'`;

			video = new Video(video, msg.author);
		}

		bot.musicPlayer.Add(msg.guild, video, voiceChannel, msg.channel);
	}
}