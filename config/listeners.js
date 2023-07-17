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
			console.log(`"/${commandName}" command by ${interaction.user.username}`)
			if (!(await db.get(`player_${interaction.user.id}`))) await db.set(`player_${interaction.user.id}`, `1|500|500|30|10|50|50|0.95|0|0_1_0|31_1_0|${Date.now()}`)
			let player = (await db.get(`player_${interaction.user.id}`)).split('|')
			db.set(`player_${interaction.user.id}`, player.join('|'))
			if (called) called.execute(bot, interaction, db, config)
			//setTimeout(async () => { await interaction.deferReply({ ephemeral: true }).catch(() => { return }) }, 2000);
		});
		console.log(`Listeners Executed`)
	}
}