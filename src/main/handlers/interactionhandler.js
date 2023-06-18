import { bot } from 'pixlbot/main/index.js';

/**
 * @typedef {import('discord.js').Interaction} Interaction
 */

export class InteractionHandler
{
	/**
	 * @param {Interaction} interaction
	 */
	OnInteract(interaction)
	{
		const handler = bot.loader.commands.get(interaction.customId);
		if (handler)
			handler.OnInteract(interaction);

		// does not invoke `interaction.update()` automatically
	}
}
