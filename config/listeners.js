const { ActivityType, PermissionsBitField } = require('discord.js');
const config = require('./config.js')

module.exports = {
	async execute(bot, db) {
		bot.on('interactionCreate', async interaction => {
			if (interaction.type == 3 || interaction.isModalSubmit()) return;
			if (!interaction.isChatInputCommand()) return;
			if (!interaction.inGuild) return;
			const { commandName } = interaction;
			const called = bot.sCommands.get(commandName)
			let player = await db.get(`player_${interaction.user.id}`)
			let playersettings = await db.get(`playersettings_${interaction.user.id}`)
			if (!player || typeof player != "string") await db.set(`player_${interaction.user.id}`, `1|500|500|30|0|50|50|0.8|0|0_1_0|31_1_0|${Date.now()}`)
			if (!playersettings || typeof playersettings != "string") await db.set(`playersettings_${interaction.user.id}`, `1`)
			if (called) called.execute(bot, interaction, db, config)
			//setTimeout(async () => { await interaction.deferReply({ ephemeral: true }).catch(() => { return }) }, 2000);
		});
		console.log(`Listeners Executed`)
	}
}