export const description = 'Remove song from queue';
export const usage = '<index>';
export const aliases = [];
export const permissions = [];

import { songQueue } from 'pixlbot/src/index.js';
import { ParseVideo } from 'pixlbot/src/API.js';

export function execute(msg, args)
{
	let queue = songQueue.get(msg.guild.id);
	if (!queue)
		return 'Server queue is empty';
	
	let index = args.length >= 1 ? parseInt(args[0]) : NaN;
	if (isNaN(index))
		return 'Invalid index';

	if (queue.songs.length <= index || index <= 0)
		return 'Index out of range';

	let title = ParseVideo(queue.songs[index]);

	queue.songs.splice(index, 1);
	return `Removed ${title} from queue`;
}
