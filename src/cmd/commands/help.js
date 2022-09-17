export const description = 'Shows a list of commands';
export const usage = '[<category>]';
export const aliases = ['?'];
export const permissions = [];

import cfg from 'pixlbot/src/config.json' assert { type: 'json' };
import { Embed } from 'pixlbot/src/API.js';

import { cmdInfo } from 'pixlbot/src/commandloader.js';

export function execute(msg, args)
{
	if (!args[0] || !cmdInfo.list[args[0].toLowerCase()])
	{
		let embed = Embed(msg.author)
			.setTitle('**Help!**')
			.setDescription(`***${cfg.prefix}help <category>*** *for more info*`);

		for (let [k, v] of Object.entries(cmdInfo.list))
			embed.addFields({ name: k, value: v });
		msg.channel.send({ embeds: [embed] });
		return;
	}

	let category = args[0].toLowerCase();

	let embed = Embed(msg.author).setTitle(category);
	for (let [k, v] of Object.entries(cmdInfo.data[category]))
		embed.addField(k, v, true);
	msg.channel.send({ embeds: [embed] });
}