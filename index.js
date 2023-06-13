const { Collection, Routes } = require('discord.js');
const config = require('./config/config.js')
const listeners = require('./config/listeners.js');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(config.TOKEN);

const fs = require('fs');
const path = require('path');
const sCommandsPath = path.join(__dirname, 'slash_commands');
const sCommandFiles = fs.readdirSync(sCommandsPath).filter(file => file.endsWith('.js'));

config.bot.sCommands = new Collection();
let scmds = []

for (const file of sCommandFiles) {
	const command = require(`./slash_commands/${file}`);
	if (command.data) {
		config.bot.sCommands.set(command.data.name, command);
		scmds.push(command.data)
	}
	// If not, it's just a slash command
}

async function start() {
	await rest.put(
		Routes.applicationGuildCommands(config.clientId, '1021592148736487467'),
		{ body: scmds.map(command => command.toJSON()) },
	).then(() => {console.log('Slash Commands Updated')}).catch(console.error);

	await listeners.execute(config.bot, config.db) // Puts "Listeners Executed" in the console

	await config.bot.login(config.TOKEN).then(() => { console.log(`Logged In`) })
}
start()