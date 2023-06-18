import { bot } from 'pixlbot/main/index.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('pixlbot/main/loader.js').Command} Command
 */

export class MessageHandler
{
	/**
	 * @param {Message} msg
	 */
	async OnMessage(msg)
	{
		if (msg.author.bot || !msg.channel)
			return;

		if (!msg.content.startsWith(cfg.prefix))
		{
			bot.AI.OnMessage(msg)
		}

		const tokens = msg.content.substring(cfg.prefix.length).split(/\s+/);
		const commandName = tokens[0].toLowerCase();

		/** @type {Command} */
		const command = bot.loader.GetCommand(commandName);
		if (!command)
			return;

		if (!msg.member.permissions.has(command.permissions))
		{
			let embed = DefaultEmbed(msg.author).setTitle('Nope.');
			msg.channel.send({ embeds: [embed] });
			return;
		}

		if (cfg.logCommands)
			bot.logger.info(`[CommandLog] ${msg.guild.name} -> ${msg.author.tag} -> ${msg.content}`);

		try
		{
			const result = await command.OnMessage(msg, tokens.splice(1));

			if (typeof(result) !== 'string')
				return;

			const embed = DefaultEmbed(msg.author).setDescription(result);
			msg.channel.send({ embeds: [embed] });
		}
		catch (error)
		{
			const embed = DefaultEmbed(msg.author)
				.setTitle('An error has occured')
				.setDescription('Sorry for the inconvenience');

			msg.channel.send({ embeds: [embed] });
			bot.logger.error(`Error on '${msg.content}' - '${error.message}'`);
			console.error(error);
		}
	}
}
