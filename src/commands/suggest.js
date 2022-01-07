const { Embed } = require('../API.js');

const { writeFile, readFileSync } = require('fs');

module.exports = {
	name: 'suggest',
	class: 'commands',
	description: 'Suggest bot features',
	usage: '<suggestion>',
	aliases: [],
	permissions: [],
	async execute(msg, args)
	{
		let embed = Embed(msg.author, args.length > 0);

		if (args.length == 0)
			return msg.channel.send(embed.setDescription('Please specify a suggestion!'));

		let filePath = `${__dirname}/../../suggestions.txt`;

		writeFile(
			filePath,
			`${readFileSync(filePath, { encoding: 'utf-8' })}${msg.author.tag} > ${args.join(' ')}\n`,
			err => {
				if (err) return msg.channel.send(embed.setDescription('Failed to send suggestion'));
			}
		);

		msg.channel.send(embed
			.setTitle('Suggestion received')
			.setDescription(args.join(' '))
		);
	}
}
