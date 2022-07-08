export const name = 'help';
export const category = 'commands';
export const description = 'Shows a list of commands';
export const usage = '[<category>]';
export const aliases = ['?'];
export const permissions = [];

import cfg from '../config.json' assert { type: 'json' };
import { Embed } from '../API.js';

import { readdirSync } from 'fs';

let commandData = {};
let commands = {}

for (let i of ['commands', 'utility', 'games', 'music'])
{
	commandData[i] = {};
	commands[i] = '';
}

commands[category] = `\`${name}\``;

commandData[category][`${cfg.prefix}${name} ${usage}`] = `${description}` +
	(permissions.length > 0 ? `\nPermissions: \`${permissions.join(', ')}\`` : '') +
	(aliases.length > 0 ? `\nAliases: \`${aliases.join(', ')}\`` : '');

for (let file of readdirSync('./src/commands/').filter(file => file.endsWith('.js') && file != 'help.js'))
{
	import(`./${file}`).then(cmd =>
	{
		if (commands[cmd.category] != '') commands[cmd.category] += ', ';
		commands[cmd.category] += `\`${cmd.name}\``;

		commandData[cmd.category][`${cfg.prefix}${cmd.name} ${cmd.usage}`] = `${cmd.description}` +
			(cmd.permissions.length > 0 ? `\nPermissions: \`${cmd.permissions.join(', ')}\`` : '') +
			(cmd.aliases.length > 0 ? `\nAliases: \`${cmd.aliases.join(', ')}\`` : '');
	});
}

export function execute(msg, args)
{
	if (!args[0] || !commands[args[0].toLowerCase()])
	{
		let embed = Embed(msg.author)
			.setTitle('**Help!**')
			.setDescription(`***${cfg.prefix}help <class>*** *for more info*`);

		for (let [k, v] of Object.entries(commands))
			if (v.length > 0)
				embed.addField(k, v);
		msg.channel.send({ embeds: [embed] });
		return;
	}

	let category = args[0].toLowerCase();

	let embed = Embed(msg.author).setTitle(category);
	for (let [k, v] of Object.entries(commandData[category]))
		embed.addField(k, v, true);
	msg.channel.send({ embeds: [embed] });
}