const { ActivityType, PermissionsBitField } = require('discord.js');
const config = require('./config.js')

module.exports = {
	async execute(bot, db) {
		bot.on('guildMemberAdd', async member => {
			member.user.send({
				embeds: [config.intro]
			}).catch(() => {
				member.guild.channels.get('1026684819565981786').send({
					content: `Welcome to Black Royalty, <@${member.user.id}>!`,
					embeds: [config.intro]
				});
			})

			await member.roles.add(await member.guild.roles.cache.find(role => role.id === "1021592761952129065"));
		});
		bot.on("error", async function(error) {
			console.warn({ error })
			await bot.guilds.cache.get('1021592148736487467').channels.cache.get('1116875114118664213').send({
				content: `<@491422360273158165>`,
				embeds: [
					{
						title: `Client Error`,
						description: `Client's WebSocket encountered a connection error:\n\`\`\`diff\n- ${error}\`\`\``,
						author: {
							name: bot.user.tag,
							icon_url: `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png?size=256`,
						},
						timestamp: new Date().toISOString(),
						footer: {
							text: bot.guilds.cache.get('1021592148736487467').name,
						},
					},
				],
			})
		});
		bot.on("rateLimit", async function(rateLimitData) {

			console.warn({ rateLimitData })
			await bot.guilds.cache.get('1021592148736487467').channels.cache.get('1116875114118664213').send({
				content: `<@491422360273158165>`,
				embeds: [
					{
						title: `Rate Limit`,
						description: `Client has reached Discord's rate limit.\n\`\`\`diff\n- ${rateLimitData}\`\`\``,
						author: {
							name: bot.user.tag,
							icon_url: `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png?size=256`,
						},
						timestamp: new Date().toISOString(),
						footer: {
							text: bot.guilds.cache.get('1021592148736487467').name,
						},
					},
				],
			})

		});
		bot.on("invalidRequestWarning", async function(invalidRequestWarningData) {

			console.warn({ invalidRequestWarningData })
			await bot.guilds.cache.get('1021592148736487467').channels.cache.get('1116875114118664213').send({
				content: `<@491422360273158165>`,
				embeds: [
					{
						title: `Rate Limit`,
						description: `Client has given Discord an invalid request. If this message is spammed, this bot may get banned.\n\`\`\`diff\n- ${invalidRequestWarningData}\`\`\``,
						author: {
							name: bot.user.tag,
							icon_url: `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png?size=256`,
						},
						timestamp: new Date().toISOString(),
						footer: {
							text: bot.guilds.cache.get('1021592148736487467').name,
						},
					},
				],
			})
		});
		bot.on("warn", async function(info) {

			console.warn({ info });
			await bot.guilds.cache.get('1021592148736487467').channels.cache.get('1116875114118664213').send({
				content: `<@491422360273158165>`,
				embeds: [
					{
						title: `Client Error`,
						description: `Client's WebSocket gave a warning:\n\`\`\`diff\n- ${info}\`\`\``,
						author: {
							name: bot.user.tag,
							icon_url: `https://cdn.discordapp.com/avatars/${bot.user.id}/${bot.user.avatar}.png?size=256`,
						},
						timestamp: new Date().toISOString(),
						footer: {
							text: bot.guilds.cache.get('1021592148736487467').name,
						},
					},
				],
			})
		});
		bot.on("voiceStateUpdate", function(oldMember, newMember) {
			setTimeout(() => {
				oldMember.guild.channels.cache.get('1040678245781229701').children.cache.forEach(channel => {
					if (channel.type === 2 && channel.id !== '1040678759646371891' && channel.members.size === 0) {
						channel.delete().catch(() => { return })
					}
				})
			}, 5000)
		});

		bot.on('interactionCreate', async interaction => {
			if (interaction.type == 3 || interaction.isModalSubmit()) return;
			if (!interaction.isChatInputCommand()) return;
			if (!interaction.inGuild) return;
			const { commandName } = interaction;
			const called = bot.sCommands.get(commandName)
			console.log(`"/${commandName}" command by ${interaction.user.tag}`)
			if (called) called.execute(bot, interaction, db, config)
			//setTimeout(async () => { await interaction.deferReply({ ephemeral: true }).catch(() => { return }) }, 2000);
		});
		console.log(`Listeners Executed`)
	}
}