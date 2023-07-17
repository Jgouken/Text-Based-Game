const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('effects')
        .setDescription(`Data is now saved, so you can no longer select stuffs. If your data gets corrupted, sorry buddy.`),

    async execute(bot, interaction, db) {
        var effects = []
        assets.statuses.forEach(stat => {
            effects.push({
                name: `${stat.id} ${stat.name}`,
                value: `${stat.description}`,
                inline: true
            })
        })


        interaction.reply({
            embeds: [
                {
                    title: "Status Effects",
                    color: 0x2B2D31,
                    fields: effects
                }
            ]
        })
    }
}
