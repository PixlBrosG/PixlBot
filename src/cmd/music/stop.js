import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class Command extends BaseCommand
{
	description = 'Stop music';

	/**
	 * @param {Message} msg
	 * @param {string[]} _args
	 * @returns {string}
	 */
	OnMessage(msg, _args)
	{
		if (!bot.musicPlayer.queue.has(msg.guildId))
			return 'Server queue is empty';
			
		let serverQueue = bot.musicPlayer.queue.get(msg.guildId);

		serverQueue.queue = [];
		serverQueue.audioPlayer.stop();
		return ':stop_button: Stopped!';
	}
}
