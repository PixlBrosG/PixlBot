import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class Command extends BaseCommand
{
	description = 'Remove song from queue';
	usage = '<index>';

	/**
	 * @param {Message} msg
	 * @param {string[]} args
	 * @returns {string}
	 */
	OnMessage(msg, args)
	{
		if (!bot.musicPlayer.queue.has(msg.guildId))
			return 'Server queue is empty';

		let serverQueue = bot.musicPlayer.queue.get(msg.guildId);
		
		let index = args.length >= 1 ? parseInt(args[0]) : NaN;
		if (isNaN(index))
			return 'Invalid index';

		if (!(serverQueue.queue.length > index > 0))
			return 'Index out of range';

		let title = bot.musicPlayer.Parse(serverQueue.queue[index]);

		serverQueue.queue.splice(index, 1);
		return `Removed ${title} from queue`;
	}
}
