import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import { appendFileSync } from 'fs';

export class Command extends BaseCommand
{
	description = 'Suggest bot features';
	usage = '<suggestion>';

	OnMessage(msg, args)
	{
		if (args.length === 0)
			return 'Please specify a suggestion!'; // Text input box thingy

		const suggestion = args.join(' ');
		const filepath = 'suggestions.txt';

		appendFileSync(filepath, `${msg.author.tag} -> ${suggestion}\n\n`);
		bot.logger.info(`Received suggestion from ${msg.author.tag} -> ${suggestion}`);

		let embed = DefaultEmbed(msg.author)
			.setTitle('Suggestion received')
			.setDescription(suggestion)
			.setThumbnail(bot.client.user.displayAvatarURL());
		msg.channel.send({ embeds: [embed] });
	}
}
