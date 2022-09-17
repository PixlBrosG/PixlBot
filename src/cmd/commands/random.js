export const description = 'random integer from <min> to <max>';
export const usage = '[<min>] <max>';
export const aliases = [];
export const permissions = [];

import { Embed, RandInt } from '../../API.js';

export function execute(msg, args)
{
	if (args[1])
	{
		if (parseInt(args[0]))
			var min = parseInt(args[0]);
		else
			return '<min> must be an integer';

		if (parseInt(args[1]))
			var max = parseInt(args[1]);
		else
			return '<max> must be an integer';
	}
	else if (args[0])
	{
		var min = 0;
		if (parseInt(args[0]))
			var max = parseInt(args[0])
		else
			return '<max> must be an integer';
	}
	else
	{
		return 'Incorrect usage';
	}

	let embed = Embed(msg.author)
		.setTitle(`Random(${min}, ${max})`)
		.setDescription(RandInt(min, max).toString());
	msg.channel.send({ embeds: [embed] });
}