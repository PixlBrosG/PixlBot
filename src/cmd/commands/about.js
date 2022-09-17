export const description = 'About me!';
export const usage = '';
export const aliases = [];
export const permissions = [];

import { Embed } from 'pixlbot/src/API.js';
import { client } from 'pixlbot/src/index.js';

import about from 'pixlbot/package.json' assert { type: 'json' };

export function execute(msg, _)
{
	let embed = Embed(msg.author)
		.setAuthor({ name: about.author })
		.setTitle(`${about.name} ${about.version}`)
		.setDescription(about.description)
		.setThumbnail(client.user.displayAvatarURL())
		.setURL(about.repository.url);
	msg.channel.send({ embeds: [embed] });
}
