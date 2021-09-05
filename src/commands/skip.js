const { songQueue, Embed } = require('../API.js');

module.exports = {
    name: 'skip',
    class: 'music',
    description: 'Skip song',
    usage: '',
    aliases: ['s'],
    permissions: [],
    async execute(msg, args) {
        if (!msg.member.voice.channel)
            return msg.channel.send(Embed(msg.author).setDescription('You need to be in a channel to execute this command!'));
        songQueue.get(msg.guild.id).connection.dispatcher.end();
        msg.channel.send(Embed(msg.author).setDescription(':fast_forward: Skipped song!'));
    }
}