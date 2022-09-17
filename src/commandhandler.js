import cfg from './config.json' assert { type: 'json' };

import MessageHandler from './messagehandler.js';
import { Embed } from './API.js';

import { cmdExe } from './commandloader.js';

export default(msg) =>
{
	if (msg.author.bot || !msg.channel) return;
	if (!msg.content.startsWith(cfg.prefix)) return MessageHandler(msg);

	let tokens = msg.content.substring(cfg.prefix.length).split(/\s+/);

	if (!cmdExe[tokens[0]])
	{
		let a = false;
		for (let k of Object.keys(cmdExe))
		{
			if (!cmdExe[k].aliases.includes(tokens[0]))
				continue;

			tokens[0] = k;
			a = true;
			break;
		}
		if (!a) return;
	}

	if (typeof cmdExe[tokens[0]].cmd !== 'function') return;

	if (!msg.member.permissions.has(cmdExe[tokens[0]].permissions))
	{
		let embed = Embed(msg.author).setTitle('Nope.');
		msg.channel.send({ embeds: [ embed ] });
		return;
	}

	if (cfg.logCommands)
		console.info(`${msg.guild.name} > ${msg.author.tag} > ${msg.content}`);

	try
	{
		let txt = cmdExe[tokens[0]].cmd(msg, tokens.splice(1));

		if (typeof txt !== 'string') return;

		let embed = Embed(msg.author).setDescription(txt);
		msg.channel.send({ embeds: [embed] });
	}
	catch (e)
	{
		let embed = Embed(msg.author)
			.setTitle('An error has occured')
			.setDescription('Sorry for the inconvenience');

		msg.channel.send({ embeds: [ embed ] });
		console.warn(msg.content);
		console.error(e);
	}
}
