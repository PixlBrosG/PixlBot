const { songQueue, Embed } = require('../API.js');

module.exports = {
    name: 'stop',
    class: 'music',
    description: 'Stop music',
    usage: '',
    aliases: [],
    permissions: [],
    async execute(msg, args) {
        const embed = Embed(msg.author);

        if (!msg.member.voice.channel) return msg.channel.send(embed.setDescription('You need to be in a channel to execute this command!'));
        if (!songQueue.get(msg.guild.id)) return msg.channel.send(embed.setDescription('Server queue is empty!'));

        songQueue.get(msg.guild.id).songs = [];
        songQueue.get(msg.guild.id).connection.dispatcher.end();
        msg.channel.send(embed.setDescription(':stop_button: Stopped!'));
    }
}