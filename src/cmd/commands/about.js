import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import pkg from '../../../package.json' assert { type: 'json' };

export class Command extends BaseCommand
{
	description = 'About me!';

	OnMessage(msg, _args)
	{
		const embed = DefaultEmbed(msg.author)
			.setAuthor({ name: pkg.author })
			.setTitle(`${pkg.name} ${pkg.version}`)
			.setDescription(pkg.description)
			.setThumbnail(bot.client.user.displayAvatarURL())
			.setURL(pkg.repository.url);
		msg.channel.send({ embeds: [embed] });
	}
}
