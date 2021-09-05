const { Embed } = require('../API.js');
const { name, version, description, author } = require('../../package.json');

module.exports = {
    name: 'about',
    class: 'commands',
    description: 'About me!',
    usage: '',
    aliases: [],
    permissions: [],
    async execute(msg, args) {
        msg.channel.send(Embed(msg.author, true)
            .setAuthor(author)
            .setTitle(`**${name}** ${version}`)
            .setDescription(description + "\n\nhttps://github.com/PixlBrosG/PixlBot")
        );
    }
}