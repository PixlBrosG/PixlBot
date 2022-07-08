import cfg from './config.json' assert { type: 'json' };

import MessageHandler from './messagehandler.js';
import { Embed } from './API.js';

import { readdirSync } from 'fs';

import { performance } from 'perf_hooks';

let commands = {};

for (let file of readdirSync('./src/commands/').filter(file => file.endsWith('.js')))
{
	let startTime = performance.now();

	import(`./commands/${file}`).then(cmd =>
	{
		commands[cmd.name] = {
			cmd: cmd.execute,
			permissions: cmd.permissions,
			aliases: cmd.aliases
		};
	});

	let time = performance.now() - startTime;
	console.log(`Loaded ${file} in ${time} ms`);
}

export default(msg) =>
{
	if (msg.author.bot || !msg.channel) return;
	if (!msg.content.startsWith(cfg.prefix)) return MessageHandler(msg);

	let tokens = msg.content.substring(cfg.prefix.length).split(/\s+/);

	if (!commands[tokens[0]])
	{
		let a = false;
		for (let k of Object.keys(commands))
		{
			if (commands[k].aliases.includes(tokens[0]))
			{
				tokens[0] = k;
				a = true;
				break;
			}
		}
		if (!a) return;
	}

	if (typeof commands[tokens[0]].cmd != 'function') return;

	if (!msg.member.permissions.has(commands[tokens[0]].permissions))
	{
		let embed = Embed(msg.author).setTitle('Nope.');
		msg.channel.send({ embeds: [ embed ] });
		return;
	}

	if (cfg.logCommands)
		console.info(`${msg.guild.name} > ${msg.author.tag} > ${msg.content}`);

	try
	{
		let txt = commands[tokens[0]].cmd(msg, tokens.splice(1));

		if (typeof txt == 'string')
		{
			let embed = Embed(msg.author).setDescription(txt);
			msg.channel.send({ embeds: [embed] });
		}
	}
	catch (e)
	{
		let embed = Embed(msg.author).setTitle('An error has occured');
		embed = embed.setDescription('Sorry for the inconvenience');

		msg.channel.send({ embeds: [ embed ] });
		console.warn(msg.content);
		console.error(e);
	}
}
