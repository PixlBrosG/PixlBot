import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { PermissionFlagsBits } from "discord.js";

export class Command extends BaseCommand
{
	description = 'Kick a member';
	usage = '<member> [<reason>]';
	permissions = [PermissionFlagsBits.KickMembers];

	OnMessage(msg, args)
	{
		let member = msg.mentions.members.first();
		if (!member) return "You didn't mention any members!";
	
		let reason = args.splice(1).join(' ');
	
		if (member.kickable)
		{
			member.kick(reason);
			return `Successfully kicked ${member}`;
		}
	
		return `**Failed to kick ${member}**\n\nThis is generally due to lacking permission or rank hierarchy`;
	}
}
