const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('craft')
        .setDescription(`Do an action regarding your inventory.`)
        .addStringOption(option =>
            option.setName('item')
                .setDescription('Type out the name of an item to craft. Not case sensitive.')
                .setRequired(false)
        ),

    async execute(bot, interaction, db) {
        if (interaction.options.getString('item')) {
            // This code is going to be laughed at, but its the simplest way I can think of!
            const item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(' ', '') == interaction.options.getString('item').toLowerCase().trim().replace(' ', ''))
            if (!item) return interaction.reply({ content: `The item ${interaction.options.getString('item')} does not exist!`, ephemeral: true })

            var player = await db.get(`player_${interaction.user.id}`)
            player = player.split('|')

            if (!item.craft) return interaction.reply({ content: `That item (${item.name}) is not even craftable!` })
            if (!player[12]) return interaction.reply({ content: `How are you even going to craft ${item.name} if you don't even have an inventory?`, ephemeral: true })

            player[12] = player[12].split('-')

            var haved = [];
            item.craft.forEach(i => {
                let material = assets.items.find(({ name }) => name == i)
                if (!material) return console.log(`An error has occurred regarding the item "${i}"`)
                player[12].forEach((invitem) => {
                    let inv = invitem.split('_')
                    if (inv[0] == assets.items.indexOf(material)) return haved.push(assets.items[inv[0]].name)
                })
            })

            const areEqual = (item.craft.sort()).every((element, index) => { return element === (haved.sort())[index]; });

            if (!areEqual) return interaction.reply({ content: `You do not have all of the materials required to craft the item "${item.name}." You are missing ${item.craft.length - haved.length} items.`, ephemeral: true })
            
            for (a = 0; a < haved.length; a++) {
                for (x = 0; x < player[12].length; x++) {
                    let inv = player[12][x].split('_')
                    if (haved[a] == assets.items[inv[0]].name) player[12].splice(x, 1)
                    break;
                }
            }

            player[12].push(`${assets.items.indexOf(item)}_1_0`)
            player[12] = player[12].join('-')
            await db.set(`player_${interaction.user.id}`, player.join('|'))

            interaction.reply({ content: `You've crafted the item ${item.name} and it has been placed in your inventory!`})
        } else {
            var embed = {
                embeds: [
                    {
                        title: "Craftable Material",
                        color: 0xffffff,
                        description: 'This list features all of the materials able to be crafted in the game.',
                        fields: []
                    }
                ]
            }

            assets.items.forEach(i => {
                if (i.craft) embed.embeds[0].fields.push({
                    name: i.name,
                    value: i.craft.join(' + '),
                    inline: true
                })
            })

            interaction.reply(embed)
        }
    }
}