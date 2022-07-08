export const name = 'stop';
export const category = 'music';
export const description = 'Stop music';
export const usage = '';
export const aliases = [];
export const permissions = [];

import { songQueue } from '../index.js';

export function execute(msg, _)
{
	if (!msg.member.voice.channel)
		return 'You need to be in a voice channel to execute this command';

	let queue = songQueue.get(msg.guild.id);

	if (!queue)
		return 'Server queue is empty';

	queue.songs = [];
	queue.audioPlayer.stop();
	return ':stop_button: Stopped!';
}