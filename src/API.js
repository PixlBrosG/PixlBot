const { embedColor } = require('./config.json');
const bot = require('./index.js');

const { MessageEmbed } = require('discord.js');

module.exports = {
	Embed(author, thumbnail = false)
	{
		let embed = new MessageEmbed()
			.setFooter(`Requested by ${author.tag}`, author.displayAvatarURL())
			.setColor(embedColor);
		return thumbnail ? embed.setThumbnail(bot.client.user.displayAvatarURL()) : embed;
	},

	RandInt(min, max)
	{
		return Math.floor(Math.random() * (max - min)) + min;
	},
	
	ParseTime(length)
	{
		length = parseInt(length);

		if (isNaN(length))
			throw `Time should be an integer\nParseTime(${length})`;

		let hours = Math.floor(length/3600);
		let minutes = Math.floor(length/60)%60;
		let seconds = length%60;
		let result = '';
		if (hours > 0) result += `${hours}:`;
		if (minutes > 0) result += `${minutes}:`;
		return result + seconds.toString();
	},

	ParseVideo(video)
	{
		return `[${video.title}](${video.url})`;
	},

	songQueue: new Map()
}