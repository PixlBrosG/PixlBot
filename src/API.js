const config = require('./config.json');
const bot = require('./index.js');

const Discord = require('discord.js');

module.exports = {
    Embed(author = null, thumbnail = false) {
        if (author != null)
        {
            embed = new Discord.MessageEmbed()
                .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL())
                .setColor(config.embedColor);
            return thumbnail ? embed.setThumbnail(bot.client.user.displayAvatarURL()) : embed;
        }
        else
        {
            return new Discord.MessageEmbed();
        }
    },

    RandInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    
    ParseTime(length) {
        length = parseInt(length);

        if (isNaN(length))
            throw `Time should be an integer\nParseTime(${length})`;

        const hours = Math.floor(length/3600);
        const minutes = Math.floor(length/60)%60;
        const seconds = length%60;
        let result = '';
        if (hours > 0) result += `${hours}:`;
        if (minutes > 0) result += `${minutes}:`;
        return result + seconds.toString();
    },

    songQueue: new Map()
}