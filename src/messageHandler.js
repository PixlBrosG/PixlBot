import cfg from './config.json' assert { type: 'json' };

import { RandInt, Embed } from './API.js';

const id = '<@744015666029396028>';

export default(msg) =>
{
	let tokens = msg.content.split(/\s+/);

	if (tokens[0] !== id) return;

	if (cfg.logMessages)
		console.info(`${msg.author.tag} > ${msg.content}`);
	
	let embed = Embed(msg.author);

	if (msg.content.endsWith('?'))
	{
		let options = cfg.chatResponses.question;
		let index = RandInt(options.length);

		embed.setTitle(':thinking: Lemme think...').setDescription(options[index]);
	}
	else
	{
		let options = cfg.chatResponses.statement;
		let index = RandInt(options.length);

		embed.setTitle(':upside_down: oh...').setDescription(options[index]);
	}

	msg.channel.send({ embeds: [ embed ] });
}