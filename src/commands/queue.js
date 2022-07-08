export const name = 'queue';
export const category = 'music';
export const description = 'Song queue';
export const usage = '';
export const aliases = ['q'];
export const permissions = [];

import { songQueue } from '../index.js';
import { Embed, ParseVideo } from '../API.js';

export function execute(msg, _)
{
	let queue = songQueue.get(msg.guild.id);
	let song  = queue.songs[0];

	if (!queue)
		return 'Server queue is empty';

	let embed = Embed(msg.author).setTitle(`Song queue (${queue.songs.length - 1} tracks)`)
		.setThumbnail(song.thumbnailURL)
		.setDescription(`**Currently playing**:\n${ParseVideo(song)} \`${song.length}\``);
	embed.footer.text += ` - Replay: ${queue.replay ? '✅' : '❌'}`;

	if (queue.songs.length > 1)
	{
		let indexes = [];
		let tracks  = [];
		let lengths = [];

		for (let i = 1; i < queue.songs.length; ++i)
		{
			indexes.push(`\`${i}\``);
			tracks.push(ParseVideo(queue.songs[i]));
			lengths.push(`\`${queue.songs[i].length}\``);
		}

		embed.addField('Index', indexes.join('\n'), true);
		embed.addField('Track', tracks.join('\n'), true);
		embed.addField('Length', lengths.join('\n'), true);
	}

	msg.channel.send({ embeds: [embed] });
}
