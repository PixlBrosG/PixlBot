import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import { bot } from 'pixlbot/main/index.js';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class Command extends BaseCommand
{
	description = 'Pong!';

	/**
	 * @param {Message} msg
	 * @param {string[]} _args
	 */
	async OnMessage(msg, _args)
	{
		const botLatency = bot.client.ws.ping;
		const userLatency = Date.now() - msg.createdTimestamp - botLatency;

		let embed = DefaultEmbed(msg.author)
			.setTitle(':ping_pong: **Pong!**')
			.addFields({ name: 'Latency', value: `User: \`${userLatency}\` ms\nBot: \`${botLatency}\` ms` })

		msg.channel.send({ embeds: [embed] });
	}
}
