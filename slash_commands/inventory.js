const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription(`Do an action regarding your inventory.`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View all items in your or another player\'s inventory')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('If you want to see the inventory of a specific user.')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('equip')
                .setDescription('Use an item from your inventory')
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('Type out the name of an item. Not case sensitive.')
                        .setRequired(true)
                )
        ),

    async execute(bot, interaction, db) {
        switch (interaction.options.getSubcommand()) {
            case 'view': {
                const user = interaction.options.getUser('user') || interaction.user
                var player = await db.get(`player_${user.id}`) || `1|500|500|30|10|50|50|0.95|0|0|31`
                var embed = {
                    thumbnail: {
                        url: interaction.user.avatarURL()
                    },
                    title: `${user.username}'s Inventory`,
                    fields: [],
                    footer: {
                        text: `If you're looking for equipped items, use /journal player`
                    }
                }
                player = player.split('|')

                if (!player[11]) embed.description = "Wow, such empty :3"
                else {
                    console.log(player[11])
                    // itemIndex_itemAmount_itemLevel-itemIndex_itemAmount_itemLevel-...
                    let inventoryItemIndexes = player[11].split('-')
                    // [itemIndex_itemAmount_itemLevel, ...]
                    inventoryItemIndexes.forEach((i) => {
                        let item = i.split('_')
                        // [itemIndex, itemAmount, itemLevel]
                        embed.fields.push({name: `**${assets.items[Number(item[0])].name}** - ${item[1]}`, value: Number(item[2]) > 0 ? `Level ${item[2]}` : '', inline: true})
                    })
                }

                interaction.reply({ embeds: [embed] })
                break;
            }

            case 'equip': {
                const item = interaction.options.getString('item')
                var player = await db.get(`player_${interaction.user.id}`) || `1|500|500|30|10|50|50|0.95|0|0|31`
                player = player.split('|')
                interaction.reply(`Not ready yet!`)
                break;
            }
        }
    }
}