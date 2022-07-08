export const name = 'replay';
export const category = 'music';
export const description = 'Replay song queue';
export const usage = '';
export const aliases = [];
export const permissions = [];

import { songQueue } from '../index.js';

export function execute(msg, _)
{
	if (!songQueue.has(msg.guild.id))
		return 'Server queue is empty';

	let queue = songQueue.get(msg.guild.id);
	queue.replay = !queue.replay;
	return `:repeat: Replay: ${queue.replay ? '✅' : '❌'}`;
}
