import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

export class Command extends BaseCommand
{
	description = 'Shows a list of commands';
	usage = '[<category>]';
	aliases = ['?'];

	OnMessage(msg, args)
	{
		let info = args.length === 0 ? {} : bot.loader.GetInfo(args[0].toLowerCase());
		if (Object.keys(info).length == 0)
		{
			info = bot.loader.GetInfo();

			let embed = DefaultEmbed(msg.author)
				.setTitle('**Help!**')
				.setDescription(`***${cfg.prefix}help <category>*** *for more info*`);

			for (let [name, value] of Object.entries(info))
				embed.addFields({ name, value });
			msg.channel.send({ embeds: [embed] });
			return;
		}

		const category = args[0].toLowerCase();
		let embed = DefaultEmbed(msg.author).setTitle(category);
		for (let [name, value] of Object.entries(info))
			embed.addFields({ name, value, inline: true });
		msg.channel.send({ embeds: [embed] });
	}
}
