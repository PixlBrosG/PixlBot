const { songQueue, Embed } = require('../API.js');

module.exports = {
    name: 'replay',
    class: 'music',
    description: 'Replay',
    usage: '',
    aliases: [],
    permissions: [],
    async execute(msg, args) {
        let queue = songQueue.get(msg.guild.id);
        songQueue.get(msg.guild.id).replay = !songQueue.get(msg.guild.id).replay;
        msg.channel.send(Embed(msg.author).setDescription(`:repeat: Replay: ${songQueue.get(msg.guild.id).replay ? '✅' : '❌'}`));
    }
}