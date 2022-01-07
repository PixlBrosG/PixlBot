const { Embed } = require('../API.js');

module.exports = {
	name: 'kick',
	class: 'utility',
	description: 'Kick a member',
	usage: '<member> [reason]',
	aliases: [],
	permissions: ['KICK_MEMBERS'],
	async execute(msg, args)
	{
		let user = msg.mentions.users.first();
		let member = msg.guild.member(user);
		let embed = Embed(msg.author);
		
		if (!member) return msg.channel.send(embed.setDescription('You didn\'t mention any users!'));

		try
		{
			let reason = args.splice(1).join(' ');
			member.kick(reason);
			msg.channel.send(`Successfully kicked ${user.tag}`).setDescription(reason);
		}
		catch (error)
		{
			msg.channel.send(embed.setTitle(`Failed to kick ${user.tag}`).setDescription('This is generally due to lacking permission or rank hierarchy'));
		}
	}
}
