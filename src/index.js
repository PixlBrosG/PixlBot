const CommandHandler = require('./commandhandler.js');

require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

function UpdateStatus() {
    client.user.setActivity(`${require('./config.json').prefix}help`, {
        type: "LISTENING"
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    UpdateStatus();
    setInterval(UpdateStatus, 3600000);
});

client.on('message', CommandHandler)

client.login(process.env.TOKEN);

module.exports.client = client;