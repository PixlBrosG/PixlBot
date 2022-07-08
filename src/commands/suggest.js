export const name = 'suggest';
export const category = 'commands';
export const description = 'Suggest bot features';
export const usage = '<suggestion>';
export const aliases = [];
export const permissions = [];

import { appendFileSync } from 'fs';

import { Embed } from '../API.js';
import { client } from '../index.js';

export function execute(msg, args)
{
	if (args.length == 0)
		return 'Please specify a suggestion';
	args = args.join(' ');

	const filePath = `suggestions.txt`;
	appendFileSync(filePath,`${msg.author.tag} > ${args}\n`);

	let embed = Embed(msg.author)
		.setTitle('Suggestion received')
		.setDescription(args)
		.setThumbnail(client.user.displayAvatarURL());
	msg.channel.send({ embeds: [embed] });
}
