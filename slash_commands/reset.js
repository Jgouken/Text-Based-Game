const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription(`Reset your player data for this game.`)
        .addStringOption(option =>
            option.setName('username')
                .setDescription('To confirm this, please type your full username.')
                .setRequired(true)
        ),

    async execute(bot, interaction, db) {
        if (interaction.options.getString('username').toLowerCase() == interaction.user.username.toLowerCase() || interaction.options.getString('username').toLowerCase() == interaction.user.tag.toLowerCase()) {
            while (await db.get(`player_${interaction.user.id}`)) await db.delete(`player_${interaction.user.id}`)
            interaction.reply({ content: "Your data has been reset!", ephemeral: true })
        } else {
            interaction.reply({ content: "You did not spell your username correctly! Your data has not been reset.", ephemeral: true })
        }
    }
}