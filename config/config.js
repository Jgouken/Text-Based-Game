const { Client, IntentsBitField } = require('discord.js');
const Database = require("@replit/database")
const token = process.env['TOKEN']
const db = new Database()
const bot = new Client({ intents: new IntentsBitField().add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildMessages) });

module.exports = {
	bot: bot,
	db: db,
	clientId: `1116563704411078766`,

	name: 'Text-Based Game',
	TOKEN: token,
}