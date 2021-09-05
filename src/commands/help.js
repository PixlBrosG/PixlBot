const { prefix } = require('../config.json');
const { Embed } = require('../API.js');

const { readdirSync } = require('fs');

const exp = {
    name: 'help',
    description: 'Shows a list of commands',
    usage: '[class]',
    aliases: ['?'],
    permissions: []
}

const classes = ['commands', 'utility', 'games', 'music'];
let commands = { main: { }, class: { } };

for (let i = 0; i < classes.length; i++) {
    commands.main[classes[i]] = [];
    commands.class[classes[i]] = { };
}

for (const file of readdirSync('./src/commands/').filter(file => file.endsWith('.js') && file != 'help.js')) {
    const cmd = require(`./${file}`);
    commands.main[cmd.class].push({
        name: cmd.name,
        description: cmd.description,
        usage: cmd.usage,
        permissions: cmd.permissions,
        aliases: cmd.aliases
    });
}
commands.main.commands.push(exp);

for (let i = 0; i < classes.length; i++) {
    let cmds = "";
    for (const cmd of commands.main[classes[i]]) {
        commands.class[classes[i]][cmd.name] = [`${prefix}${cmd.name} ${cmd.usage}`,
            `${cmd.description}` +
            (cmd.permissions.length > 0 ? `\nPermissions: \`${cmd.permissions.join(', ')}\``: '') +
            (cmd.aliases.length > 0 ? `\nAliases: \`${cmd.aliases.join(', ')}\`` : '')];
        if (cmds != '') cmds += ', ';
        cmds += `\`${cmd.name}\``;
    }
    commands.main[classes[i]] = cmds;
}

module.exports = exp;

module.exports.execute = async (msg, args) => {
    if (!args[0] || !commands.main[args[0].toLowerCase()]) {
        let embed = Embed(msg.author)
            .setTitle('**Help!**')
            .setDescription(`***${prefix}help class*** *for more info*`);
        for (const c of classes) embed = embed.addField(c, commands.main[c]);
        return msg.channel.send(embed);
    }
    let embed = Embed(msg.author).setTitle(args[0].toLowerCase());
    for (const c of Object.values(commands.class[args[0].toLowerCase()]))
        embed = embed.addField(c[0], c[1], true);
    return msg.channel.send(embed);
}