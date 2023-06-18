import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class Command extends BaseCommand
{
	description = 'Remove song from queue';
	usage = '<index>'

	/**
	 * @param {Message} msg
	 * @param {string[]} _args
	 * @returns {string}
	 */
	OnMessage(msg, _args)
	{
		if (!bot.musicPlayer.queue.has(msg.guildId))
			return 'Server queue is empty';

		let queue = bot.musicPlayer.queue.get(msg.guildId);
		queue.replay = !queue.replay;
		return `:repeat: Replay: ${queue.replay ? '✅' : '❌'}`;
	}
}
