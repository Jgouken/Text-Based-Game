const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('howtoplay')
        .setDescription(`Data is now saved, so you can no longer select stuffs. If your data gets corrupted, sorry buddy.`),

    async execute(bot, interaction, db) {
        interaction.reply({
            embeds: [
                {
                    title: `How to Play`,
                    color: 0x2B2D31,
                    description: `Welcome to the unnamed game Text-Based-Game created by <@491422360273158165>! The following illustrates the instructions and nitty gritty on how to play around with the robot. If you have any questoins, feel free to let Jgouken know!`,
                    fields: [
                        {
                            name: "⚔️ __Encounters__",
                            value: "`/encounter <area>`\n\nEncounters are the bread and butter of the robot. Encounters let you battle an enemy within an area at a certain level, similar to pokemon.\n\nEach area is specified for certain levels that have certain enemies, all the way up until the \"endless mode\" of Eternal Damnation. Your health, stamina, and inventory is saved at the end of the battle.",
                            inline: true
                        },
                        {
                            name: "🎒 __Inventory__",
                            value: "`/inventory view (@user)`\n`/inventory use <item>`\n\nView your or another player's inventory or use an item from your inventory. Some items, titled Crafting Regeants, cannot be used and others can only be used during battles.\n\nWarning: I wont stop you if you do something like use a health potion at full health.",
                            inline: true
                        },
                        {
                            name: "📖 __Journal__",
                            value: "`/jounral area <area>`\n`/jounral enemy <enemy>`\n`/jounral effects`\n`/jounral items`\n`/jounral player (@user)`\n\nView specific information about an area, an enemy, the effects in battle, an item, or a player! Use the player journal to learn information about yourself. \n\nThe journal command basically helps you attain knowledge for each attribute of the game.",
                            inline: true
                        },
                        {
                            name: "🛠️ __Crafting__",
                            value: "`/craft (item)`\n\nUsing Craft Reagents from your inventory, craft other items that can be useful in battle including bombs, crystals, and flasks that can aid during battle!\n\nIf you don't specify an item to craft, it will instead show you all craftable items, and what they require. Weapons and Armor cannot be crafted (yet?).",
                            inline: true
                        },
                        {
                            name: "📌 __Point of the Game__",
                            value: "The point of the game is to get to level 50, gathering plenty of items, then progressing to killing the Demon Queen! Progress is slow, but it'll be highly rewarding!\n\nTake turns slapping enemies until either of you die. Battle your way through goblins, slimes, skeletons, and even vampires to murder your way to the boss!",
                            inline: true
                        }
                    ],
                    footer: {
                        text: `🔄️ /reset <username> - Reset your data entirely and restart from level 1.`
                    }
                }
            ],
            ephemeral: true
        })
    }
}