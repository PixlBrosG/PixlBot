export const name = 'queue';
export const category = 'music';
export const description = 'Song queue';
export const usage = '';
export const aliases = ['q'];
export const permissions = [];

import { songQueue } from '../index.js';
import { Embed, ParseVideo } from '../API.js';

function queueEntry(song)
{
	return ParseVideo(song) + `\`${song.length}\``;
}

export function execute(msg, _)
{
	let queue = songQueue.get(msg.guild.id);

	if (!queue)
		return 'Server queue is empty';

	let embed = Embed(msg.author).setTitle(`Song queue (${queue.songs.length - 1} tracks)`)
		.setThumbnail(queue.songs[0].thumbnailURL)
		.setDescription(`**Currently playing**:\n${queueEntry(queue.songs[0])}`);
	embed.footer.text += ` - Replay: ${queue.replay ? '✅' : '❌'}`;

	if (queue.songs.length > 1)
	{
		embed.description += '\n';

		for (let i = 1; i < queue.songs.length; ++i)
			embed.description += `\n\`${i}\` ${queueEntry(queue.songs[i])}`;
	}

	msg.channel.send({ embeds: [embed] });
}
