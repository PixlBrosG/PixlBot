const { RandInt, Embed } = require("./API.js");
const { chat } = require("./config.json");

module.exports = async function(msg)
{
	let tokens = msg.content.split(/\s+/);

	let user = msg.mentions.users.first();
	let member = msg.guild.member(user);

	if (!member) return;

	let embed = Embed(msg.author);

	if (tokens[0] === "<@!744015666029396028>")
	{
		console.log(`${msg.author.tag} > ${msg.content}`);

		if (msg.content.endsWith('?'))
		{
			let options = chat.responses.question;
			let index = RandInt(0, options.length);

			msg.channel.send(embed.setTitle(":thinking: Lemme think...").setDescription(options[index]));
		}
		else
		{
			let options = chat.responses.statement;
			let index = RandInt(0, options.length);

			msg.channel.send(embed.setTitle(":upside_down: oh...").setDescription(options[index]));
		}
	}
}
