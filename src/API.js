import cfg from './config.json' assert { type: 'json' };

import { MessageEmbed } from 'discord.js';

export function Embed(author)
{
	let embed = new MessageEmbed().setColor(cfg.embedColor);

	return embed.setFooter({
		text: `Requested by ${author.tag}`,
		iconURL: author.iconURL ? author.iconURL : author.displayAvatarURL()
	});
}

export function RandInt(...args)
{
	let min = args[1] ? args[0] : 0;
	let max = args[1] ? args[1] : args[0];

	return Math.floor(Math.random() * (max - min)) + min;
}

export function Choice(list)
{
	return list[Math.floor(Math.random() * list.length)];
}

export function ParseVideo(video)
{
	return `[${video.title}](${video.url})`;
}
