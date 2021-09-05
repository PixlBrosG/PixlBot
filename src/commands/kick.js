const { Embed } = require('../API.js');

module.exports = {
    name: 'kick',
    class: 'utility',
    description: 'Kick a member',
    usage: '<member> [reason]',
    aliases: [],
    permissions: ['KICK_MEMBERS'],
    async execute(msg, args) {
        const user = msg.mentions.users.first();
        const member = msg.guild.member(user);
        const embed = Embed(msg.author);
        
        if (!member) return msg.channel.send(embed.setDescription('You didn\'t mention any users!'));

        const reason = args.splice(1).join(' ');
        return member.kick(reason).then(() => {
            msg.channel.send(embed.setTitle(`Successfully kicked ${user.tag}`).setDescription(reason));
        }).catch(err => {
            msg.channel.send(embed.setTitle(`Failed to kick ${user.tag}`).setDescription('This us generally due to lacking permission or rank hierarchy'));
        })
    }
}