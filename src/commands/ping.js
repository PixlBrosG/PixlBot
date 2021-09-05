const { Embed } = require('../API.js');

module.exports = {
    name: 'ping',
    class: 'utility',
    description: 'Pong!',
    usage: '',
    aliases: ['pong'],
    permissions: [],
    async execute(msg, args) {
        const embed = Embed(msg.author).setTitle(':ping_pong: **Pong!**');
        msg.channel.send(embed).then(m => {
            const ping = m.createdTimestamp - msg.createdTimestamp;
            m.edit(embed.setDescription(`${ping} ms`));
            console.log(`${ping} ms`);
        });
    }
}