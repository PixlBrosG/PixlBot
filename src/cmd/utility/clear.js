import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { PermissionFlagsBits } from "discord.js";

export class Command extends BaseCommand
{
	description = 'Clear messages from the current channel';
	usage = '<amount>';
	permissions = [PermissionFlagsBits.ManageMessages];

	async OnMessage(msg, args)
	{
		await msg.delete();

		let amount = parseInt(args[0]);
		if (amount > 100)
			amount = 100;

		if (isNaN(amount))
			return 'Amount should be an integer';
		if (amount <= 0)
			return 'Amount should be more than zero';

		msg.channel.bulkDelete(amount, true);
	}
}
