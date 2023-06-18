import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';
import { Choice } from 'pixlbot/utils/random.js';

export class Command extends BaseCommand
{
	description = 'Let me choose for you!';
	usage = '<...>';

	OnMessage(msg, args)
	{
		if (args.length === 0)
			return 'Give me some choices... \\:(';

		const embed = DefaultEmbed(msg.author)
			.setTitle(':game_die: I choose...')
			.setDescription(Choice(args));
		msg.channel.send({ embeds: [embed] });
	}
}
