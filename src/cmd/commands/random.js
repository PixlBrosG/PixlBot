import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';
import { RandInt } from 'pixlbot/utils/random.js';

export class Command extends BaseCommand
{
	description = 'Random integer between <min> (inclusive) and <max> (exclusive)';
	usage = '[<min>] <max>';

	OnMessage(msg, args)
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

		let embed = DefaultEmbed(msg.author)
			.setTitle(`Random(${min}, ${max})`)
			.setDescription(RandInt(min, max).toString());
		msg.channel.send({ embeds: [embed] });
	}
}