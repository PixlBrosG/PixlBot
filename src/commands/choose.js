export const name = 'choose';
export const category = 'commands';
export const description = 'Let me choose for you!';
export const usage = '<...>';
export const aliases = [];
export const permissions = [];

import { Embed, RandInt } from '../API.js';

export function execute(msg, args)
{
	if (args.length == 0)
		return 'Give me some choices \\:(';

	let embed = Embed(msg.author).setTitle('I choose...')
		.setDescription(args[RandInt(args.length)]);

	msg.channel.send({ embeds: [embed] });
}