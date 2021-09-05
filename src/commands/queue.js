const { songQueue, Embed } = require('../API.js');

module.exports = {
    name: 'queue',
    class: 'music',
    description: 'Song queue',
    usage: '',
    aliases: [],
    permissions: [],
    async execute(msg, args) {
        let embed = Embed(msg.author);
        const serverQueue = songQueue.get(msg.guild.id);

        if (!serverQueue) return msg.channel.send(embed.setDescription('Server queue is empty!'));

        if (serverQueue.songs.length > 1) {
            let songs = ['', ''];
            for (let i = 1; i < serverQueue.songs.length; i++) {
                songs[0] += `\`${serverQueue.songs[i].title}\`\n`;
                songs[1] += `\`${serverQueue.songs[i].length}\`\n`;
            }
            embed = embed
                .addField('Song', songs[0], true)
                .addField('Length', songs[1], true);
        }
        msg.channel.send(embed
            .setDescription(`Currently playing:\n\`${serverQueue.songs[0].title}\` **-** \`${serverQueue.songs[0].length}\``)
            .setFooter(`${embed.footer.text} - Replay: ${serverQueue.replay ? '✅' : '❌'}`, embed.footer.iconURL)
        );
    }
}