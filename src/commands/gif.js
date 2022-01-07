const { RandInt } = require('../API.js');

const fetch = require('node-fetch');
require('dotenv').config();

module.exports = {
	name: 'gif',
	class: 'commands',
	description: 'Send a GIF!',
	usage: '[query]',
	aliases: [],
	permissions: [],
	async execute(msg, args)
	{
		let result = (await (await fetch(`https://g.tenor.com/v1/search?q=${args.join('%20')}&key=${process.env.TENORAPIKEY}`)).json()).results;
		result = result[RandInt(0, result.length)].url
		console.log(result);
		msg.channel.send(result);
	}
}
