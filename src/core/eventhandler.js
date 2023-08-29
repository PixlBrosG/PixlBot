import { bot } from 'pixlbot/core/index.js';

import { defaultEmbed, parseTokens } from 'pixlbot/util/util.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Interaction} Interaction
 * @typedef {import('pixlbot/core/commandloader').Command} Command
 */

export class EventHandler
{
	/** @param {Message} msg */
	async onMessage(msg)
	{
		if (msg.author.bot || !msg.channel)
			return;

		if (!msg.content.startsWith(cfg.prefix))
		{
			bot.AIManager.onMessage(msg);
			return;
		}

		const tokens = msg.content.substring(cfg.prefix).split(/\s+/);
		const commandName = tokens[0].toLowerCase();

		/** @type {Command} */
		const command = bot.commandLoader.getCommand(commandName);
		if (!command || !command.enabled || !command.onMessage)
			return;

		if (!msg.member.permissions.has(command.permissions))
		{
			let embed = defaultEmbed().setTitle('Nope.');
			msg.channel.send({ embeds: [embed] });
			return;
		}

		if (cfg.logCommands)
			bot.logger.info(bot.logger.tag.COMMAND_LOG, `[${msg.guild.name}] ${msg.author.username} -> ${msg.content}`);

		let parsedTokens;

		try
		{
			parsedTokens = parseTokens(command, tokens.splice(1));
		}
		catch (error)
		{
			const embed = defaultEmbed(msg.author)
				.setTitle(`Usage: ${cfg.prefix}${commandName} ${command.usage}`)
				.setDescription(error);
			msg.channel.send({ embeds: [embed] });
			return;
		}

		try
		{
			const result = await command.onMessage(msg, parsedTokens);
			if (typeof(result) !== 'string')
				return;

			const embed = defaultEmbed(msg.author).setDescription(result);
			msg.channel.send({ embeds: [embed] });
		}
		catch (error)
		{
			const embed = defaultEmbed(msg.author)
				.setTitle('An error has occured')
				.setDescription('Sorry for the inconvenience');

			msg.channel.send({ embeds: [embed] });
			bot.logger.error(bot.logger.tag.EVENT_HANDLER, `Error on ${msg.content} - ${error.message}`);
			console.error(error);
		}
	}

	/**
	 * This does not invoke 'interaction.update()'
	 *
	 * @param {Interaction} interaction
	 */
	onInteract(interaction)
	{
		const handler = bot.commandLoader.commands.get(interaction.customId)
		if (handler)
			handler.onInteract(interaction);
	}
}
