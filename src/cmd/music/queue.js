import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('pixlbot/main/music.js').Video} Video
 */

/**
 * @param {Video} video
 */
function QueueEntry(video)
{
	return bot.musicPlayer.Parse(video) + `\`${video.durationRaw}\``;
}

export class Command extends BaseCommand
{
	description = 'Song queue';
	aliases = ['q'];

	/**
	 * @param {Message} msg
	 * @param {*} _args
	 * @returns {string}
	 */
	OnMessage(msg, _args)
	{
		if (!bot.musicPlayer.queue.has(msg.guild.id) ||
			bot.musicPlayer.queue.get(msg.guildId).queue.length === 0)
			return 'Server queue is empty';

		let serverQueue = bot.musicPlayer.queue.get(msg.guild.id);

		let tracks = '';
		if (serverQueue.queue.length > 1)
		{
			tracks += '\n';

			for (let i = 1; i < serverQueue.queue.length; ++i)
				tracks += `\n\`${i}\` ${QueueEntry(serverQueue.queue[i])}`;
		}

		let embed = DefaultEmbed(msg.author)
			.setTitle(`Song queue (${serverQueue.queue.length - 1} tracks)`)
			.setThumbnail(serverQueue.queue[0].thumbnailURL)
			.setDescription(`Replay: ${serverQueue.replay ? '✅' : '❌'}\n**Currently playing**:\n${QueueEntry(serverQueue.queue[0])}${tracks}`);

		msg.channel.send({ embeds: [embed] });
	}
}
