export const name = 'kick';
export const category = 'utility';
export const description = 'Kick a member';
export const usage = '<member> [<reason>]';
export const aliases = [];
export const permissions = ['KICK_MEMBERS'];

//import { Embed } from '../API.js';

export function execute(msg, args)
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
