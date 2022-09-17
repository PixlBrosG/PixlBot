export const description = 'Pong!';
export const usage = '';
export const aliases = ['pong'];
export const permissions = [];

import { Embed } from '../../API.js';

export async function execute(msg, _)
{
	let embed = Embed(msg.author).setTitle(':ping_pong: **Pong!**');

	let m = await msg.channel.send({ embeds: [embed] });

	let ping = m.createdTimestamp - msg.createdTimestamp;
	embed.setDescription(`${ping} ms`);
	m.edit({ embeds: [embed] });
}