const { Embed } = require('../API.js');
const { name, version, description, author } = require('../../package.json');
const github = "https://github.com/PixlBrosG/PixlBot";

module.exports = {
	name: 'about',
	class: 'commands',
	description: 'About me!',
	usage: '',
	aliases: [],
	permissions: [],
	execute(msg, _args)
	{
		msg.channel.send(Embed(msg.author, true)
			.setAuthor(author)
			.setTitle(`**${name}** ${version}`)
			.setDescription(description + `\n\nCheck out my [Github](${github})!`)
		);
	}
}
