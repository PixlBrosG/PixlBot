const { prefix } = require("./config.json");

const { readdirSync } = require('fs');

let commands = {};
let commandList = [];

for (const file of readdirSync('./src/commands/').filter(file => file.endsWith('.js'))) {
    const cmd = require(`./commands/${file}`);
    commands[cmd.name] = {
        cmd: cmd.execute,
        class: cmd.class,
        permissions: cmd.permissions,
        aliases: cmd.aliases
    };
    commandList.push(cmd.name);
}

module.exports = async function (msg) {
    if (msg.author.bot || !msg.content.startsWith(prefix) || !msg.channel) return;
    const tokens = msg.content.substring(prefix.length).split(/\s+/);
    
    if (!commands[tokens[0]]) {
        let a = false;
        for (const c of commandList) {
            if (commands[c].aliases.includes(tokens[0])) {
                tokens[0] = c;
                a = true;
                break;
            }
        }
        if (!a) return;
    }

    if (typeof commands[tokens[0]].cmd != "function") return;

    if (!msg.channel.guild.member(msg.author).hasPermission(commands[tokens[0]].permissions))
        return msg.channel.send('Nope');

    console.log(`${msg.guild.name} > ${msg.author.tag} > ${msg.content}`);
    commands[tokens[0]].cmd(msg, tokens.splice(1));
}