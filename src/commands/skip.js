export const name = 'skip';
export const category = 'music';
export const description = 'Skip song';
export const usage = '';
export const aliases = ['s'];
export const permissions = [];

import { songQueue } from '../index.js';

export function execute(msg, _)
{
	if (!songQueue.has(msg.guild.id))
		return 'Server queue is empty';

	songQueue.get(msg.guild.id).audioPlayer.stop();
	return ':fast_forward: Skipped song!';
}