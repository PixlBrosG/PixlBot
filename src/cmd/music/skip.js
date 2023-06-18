import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class Command extends BaseCommand
{
	description = 'Skip song';
	aliases = ['s'];

	/**
	 * @param {Message} msg
	 * @param {string[]} _args
	 * @returns {string}
	 */
	OnMessage(msg, _args)
	{
		if (!bot.musicPlayer.queue.has(msg.guild.id))
			return 'Server queue is empty';

		bot.musicPlayer.queue.get(msg.guild.id).audioPlayer.stop();
		return ':fast_forward: Skipped song!';
	}
}
