const { SlashCommandBuilder } = require('discord.js');
const inventory = require('./inventory.js');
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
            const item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/g, '') == interaction.options.getString('item').toLowerCase().trim().replace(/[ ]/g, ''))
            if (!item) return interaction.reply({ content: `The item ${interaction.options.getString('item')} does not exist!`, ephemeral: true })

            var player = await db.get(`player_${interaction.user.id}`)
            player = player.split('|')

            if (!item.craft) return interaction.reply({ content: `That item (${item.name}) is not craftable!`, ephemeral: true })
            if (!player[12]) return interaction.reply({ content: `How are you even going to craft the ${item.name} if you don't even have anything in your inventory?`, ephemeral: true })

            var areEqual = []
            for (i = 0; i < item.craft.length; i++) {
                if ((await inventory.player.search((await db.get(`player_${interaction.user.id}`)), item.craft[i]))) {
                    areEqual.push(item.craft[i])
                }
            }
            console.log(areEqual)

            if (areEqual.length !== item.craft.length) {
                var dontHave = []
                for (i = 0; i < item.craft.length; i++) {
                    if (!(await inventory.player.search((await db.get(`player_${interaction.user.id}`)), item.craft[i]))) {
                        dontHave.push(item.craft[i])
                    }
                }
                interaction.reply({ content: `You do not have all of the materials required to craft the item "${item.name}." You are missing ${item.craft.length - areEqual.length} item${item.craft.length - areEqual.length > 1 ? 's' : ''} (${dontHave.join(', ')}).`, ephemeral: true })
                return;
            }

            await db.set(`player_${interaction.user.id}`, await inventory.player.remove((await db.get(`player_${interaction.user.id}`)), areEqual, 0))
            await db.set(`player_${interaction.user.id}`, await inventory.player.add((await db.get(`player_${interaction.user.id}`)), item.name, (item.maxlvl ? Math.floor(Math.random() * (item.maxlvl - item.minlvl) - item.minlvl) : (item.minlvl || 0)) || 0))
            interaction.reply({ content: `You've crafted the ${item.name} and it has been placed in your inventory!`, ephemeral: true })
        } else {
            var embed = {
                embeds: [
                    {
                        title: "Craftable Material",
                        color: 0x2B2D31,
                        description: 'This list features all of the materials able to be crafted in the game.',
                        fields: []
                    }
                ],
                ephemeral: true
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