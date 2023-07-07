const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('journal')
        .setDescription(`Data is now saved, so you can no longer select stuffs. If your data gets corrupted, sorry buddy.`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('area')
                .setDescription('View the levels and stats of an area')
                .addStringOption(option =>
                    option.setName('area')
                        .setDescription('Type out the name of an area.')
                        .addChoices(
                            { name: '1-5 Warhamshire', value: '0' },
                            { name: '5-10 Warham Castle', value: '1' },
                            { name: '8-14 Hinterland', value: '2' },
                            { name: '12-18 Uralan Mountains', value: '3' },
                            { name: '16-22 Vulpeston', value: '4' },
                            { name: '21-29 Vulpes Tower', value: '5' },
                            { name: '30-35 Vexadel', value: '6' },
                            { name: '35-40 Vexadel Gaillard', value: '7' },
                            { name: '40-45 Sanguisuge', value: '8' },
                            { name: '45-50 Sangston Mansion', value: '9' },
                            { name: '50+ Eternal Damnation', value: '10' },
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('enemy')
                .setDescription('View the stats of an enemy in the game at a specified level')
                .addStringOption(option =>
                    option.setName('enemy')
                        .setDescription('Type out the name of an enemy. Not case sensitive.')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('enemylvl')
                        .setDescription('Choose a level for the enemies\' stats')
                        .setMinValue(1)
                        .setMaxValue(50)
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('effects')
                .setDescription('View the descriptions of the status effects in the game')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('items')
                .setDescription('View the stats of an item')
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('Type out the name of an item. Not case sensitive.')
                        .setRequired(true)
                )
        )
    /*
    .addSubcommand(subcommand =>
        subcommand
            .setName('player')
            .setDescription('View your stats')
    )
    */
    ,

    async execute(bot, interaction, db) {
        switch (interaction.options.getSubcommand()) {
            case 'area': {
                const area = assets.areas.find(a => a.name.toLocaleLowerCase() == interaction.options.getString('area').toLowerCase())

                if (!area) return interaction.reply({ content: `Hm, I can't seem to find an area titled "${interaction.options.getString('area')}." Make sure you spelled it correctly!`, ephemeral: true })

                interaction.reply({
                    embeds: [
                        {
                            title: area.name,
                            description: `Level ${area.minlvl} - ${area.maxlvl}`,
                            fields: [
                                {
                                    name: "Enemies",
                                    value: area.enemies.join(', ')
                                }
                            ]
                        }
                    ]
                })
                break;
            }

            case 'enemy': {
                const enemy = assets.enemies.find(a => a.name.toLocaleLowerCase() == interaction.options.getString('enemy').toLowerCase())
                const enemylvl = interaction.options.getInteger('enemylvl')

                if (!enemy) return interaction.reply({ content: `Hm, I can't seem to find an enemy by the name of "${interaction.options.getString('enemy')}." Make sure you spelled it correctly!`, ephemeral: true })

                let fields = [
                    {
                        name: `💖 ${Math.round(enemy.maxHealth + ((enemylvl / 2) ** 1.72424))}`,
                        value: `Health`,
                        inline: true
                    },
                    {
                        name: `⚔️ ${Math.round(enemy.attack + (enemylvl ** 1.62424))}`,
                        value: `Attack`,
                        inline: true
                    },
                    {
                        name: `🛡️ ${enemy.maxdef ? `${Math.round(enemy.mindef * 10)}% - ${Math.round(enemy.maxdef * 10)}%` : 0}`,
                        value: `Defense`,
                        inline: true
                    },
                    {
                        name: `🎯 ${Math.round(enemy.accuracy * 100)}%`,
                        value: `Accuracy`,
                        inline: true
                    },
                    {
                        name: `💥 ${Math.round(enemy.critical * 100)}%`,
                        value: `Crit Chance`,
                        inline: true
                    },
                    {
                        name: "Weapon",
                        value: enemy.weapon || 'None',
                        inline: true
                    }
                ]

                enemy.skills.forEach((skill) => {
                    let final = [`Chance: __${Math.round(skill.chance * 100)}%__\n`]

                    if (skill.times) {
                        if (skill.damage) final.push(`Deals ${Math.round(skill.damage * 100)}% base damage ${skill.times} times`)
                        else final.push(`Hits ${skill.times} times`)
                    } else if (skill.damage) final.push(`Deals ${Math.round(skill.damage * 100)}% base damage`)
                    if (skill.health) final.push(`Heals ${Math.round(skill.health * 100)}% health`)
                    if (skill.pstatus) final.push(`Inflicts: \`${skill.pstatus.join('')}\``)
                    if (skill.estatus) final.push(`Gains: \`${skill.estatus.join('')}\``)
                    fields.push({ name: skill.name, value: final.join('\n'), inline: true })
                })

                interaction.reply({
                    embeds: [
                        {
                            title: enemy.name,
                            description: `Level ${enemylvl || 1}`,
                            thumbnail: {
                                url: enemy.sprite
                            },
                            fields: fields
                        }
                    ]
                })
                break;
            }

            case 'effects': {
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
                            fields: effects
                        }
                    ]
                })
                break;
            }

            case 'items': {
                const item = assets.items.find(a => a.name.toLocaleLowerCase() == interaction.options.getString('item').toLowerCase())

                if (!item) return interaction.reply({ content: `Hm, I can't seem to find an item by the name of "${interaction.options.getString('enemy')}." Make sure you spelled it correctly!`, ephemeral: true })

                var embed = {
                    title: item.name
                }

                if (item.description) embed.description = item.description
                var fields = []

                if (item.armor) {
                    // It is an armor
                    fields.push({
                        name: `🪖 ${item.armor}*`,
                        value: `*Varies by player/item level`,
                        inline: true
                    })

                    fields.push({
                        name: `💨 ${item.evasion}*`,
                        value: `Evasion`,
                        inline: true
                    })

                    if (item.synergies) {
                        item.synergies.forEach(sng => {
                            var syn = []
                            if (sng.critical) syn.push(`💥 +${sng.critical * 100}%`)
                            if (sng.evasion) syn.push(`💨 +${sng.evasion * 100}%`)
                            if (sng.armor) syn.push(`🪖 +${sng.armor}`)
                            if (sng.attack) syn.push(`⚔️ +${sng.attack}`)
                            fields.push({
                                name: `Synergy: ${sng.name}`,
                                value: `Weapon: ${sng.weapon}\n${syn.join('\n')}`,
                                inline: true
                            })
                        })
                    }
                } else if (item.skills) {
                    // It is a weapon
                    fields = [
                        {
                            name: `⚔️ +${item.attack}*`,
                            value: `Level ${item.minlvl == item.maxlvl ? item.minlvl : `${item.minlvl} - ${item.maxlvl}`}\n*Varies by item/player level`,
                            inline: true
                        },
                        {
                            name: `💥 +${item.crit * 100}%`,
                            value: `Crit Chance`,
                            inline: true
                        },
                    ]

                    item.skills.forEach((skill) => {
                        var final = []
                        if (skill.description) final.push(`${skill.description}\n`)
                        if (skill.times) {
                            if (skill.damage) final.push(`Deal ${Math.round(skill.damage * 100)}% base damage ${skill.times} times`)
                            else final.push(`Hits ${skill.times} times`)
                        } else if (skill.damage) final.push(`Deal ${Math.round(skill.damage * 100)}% base damage`)
                        if (skill.health) final.push(`Heals ${Math.round(skill.health * 100)}% health`)
                        if (skill.estatus) final.push(`Inflicts: \`${skill.estatus.join('')}\``)
                        if (skill.pstatus) final.push(`Gains: \`${skill.pstatus.join('')}\``)
                        if (final.length > 0) fields.push({ name: `${skill.name}${skill.cost ? ` - ⚡${skill.cost}` : ''}`, value: final.join('\n'), inline: true })
                    })
                } else {
                    // It is an other item
                    var does = []
                    if (item.craft) embed.description = item.craft.join(' + ')
                    if (item.health) does.push(`💗 Heals ${item.health * 100}% HP`)
                    if (item.defense) does.push(`🪖 Grants +${item.defense * 100}% Armor`)
                    if (item.xp) does.push(`🪷 Generates +${item.xp}% XP`)
                    if (item.stamina) does.push(`⚡ Regenerates +${item.stamina * 100}% Stamina`)
                    if (item.attack) does.push(`⚔️ Grants +${item.attack * 100}% Attack`)
                    if (item.damage) does.push(`⚔️ Deals ${item.damage} damage (ignores defense)`)
                    if (item.pstatus) does.push(`Grants: \`${item.pstatus.join('')}\``)
                    if (item.estatus) does.push(`Inflicts: \`${item.estatus.join('')}\``)

                    if (does.length > 0) fields.push({
                        name: "Effect",
                        value: item.uses.join('\n'),
                        inline: true
                    })

                    if (item.uses) fields.push({
                        name: "Used To Craft:",
                        value: item.uses.join(', '),
                        inline: true
                    })
                }

                if (fields.length != 0) embed.fields = fields

                interaction.reply({
                    embeds: [embed]
                })
                break;
            }

            case 'player': {
                interaction.reply("Yeah, I'm just gonna do this later...")
                break;
            }
        }
    }
}