const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('journal')
        .setDescription(`Search for a player, item, enemy, area, or effects by typing its name.`)
        .addStringOption(option =>
            option.setName('entity')
                .setDescription('View another user, an item, weapon, armor, enemy, or area by typing its name.')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Set the preview level for certain items and enemies.')
                .setMinValue(1)
                .setMaxValue(50)
                .setRequired(false)
        )
    ,

    async execute(bot, interaction, db) {
        var level = Number(interaction.options.getInteger("level"))
        var user = interaction.options.getString("entity") ? await bot.users.cache.get(interaction.options.getString("entity").replace(/[<@!>]/gm, '')) : interaction.user

        if (!user) {
            var item = assets.items.find(a => a.name.toLocaleLowerCase().replace(/[ ]/g, '') == interaction.options.getString('entity').toLowerCase().trim().replace(/[ ]/g, '')) || assets.chests.find(a => a.name.toLocaleLowerCase().replace(/[ ]/g, '') == interaction.options.getString('entity').toLowerCase().trim().replace(/[ ]/g, ''))
            var area = assets.areas.find(a => a.name.toLocaleLowerCase().replace(/[ ]/g, '') == interaction.options.getString('entity').toLowerCase().trim().replace(/[ ]/g, ''))
            var enemy = assets.enemies.find(a => a.name.toLocaleLowerCase().replace(/[ ]/g, '') == interaction.options.getString('entity').toLowerCase().trim().replace(/[ ]/g, ''))
        }

        if (user) {
            const fetchedUser = await user.fetch(true)
            if (user.bot) return interaction.reply({ content: "That's a robot, my friend! They can't play this game.", ephemeral: true })
            var player = await db.get(`player_${user.id}`) || `1|500|500|30|10|50|50|0.95|0|0_1_0|31_1_0|${Date.now()}`
            player = player.split('|')

            /*
                  0		     1				2			3	     4		 	5		    	6	    	  7	  	  8	 	  9			10				  11
                Level | Max Health | Current Health | Attack | Armor | Max Stamina | Current Stamina | Accuracy | XP | Weapon | Armor Type | Items (itemid_amount)
            */

            let rawWeapon = player[9].split('_')
            let rawArmor = player[10].split('_')
            let weapon = assets.items[Number(rawWeapon[0])]
            let armor = assets.items[Number(rawArmor[0])]
            let level = Number(player[0])
            let weaponlvl = Number(rawWeapon[1])
            let armorlvl = Number(rawArmor[1])

            var p = {
                name: user.username.toLocaleUpperCase(),
                level: level,

                maxHealth: Math.round(Number(player[1])),
                health: Math.round(Number(player[2])),

                maxStamina: Math.round(Number(player[5])),
                stamina: Math.round(Number(player[6])),

                attack: Math.round(Number(player[3]) + Number(6 * (level - 1)) + Number(weapon.attack) + Number(weaponlvl) + Number(level * Number(weapon.plvlmult))),
                armor: Math.round(Number(Number(player[4]) + Number(armor.armor) + Number(level * Number(armor.plvlmult)) + Number(Number(armorlvl) * Number(armor.alvlmult)))),

                accuracy: Number(player[7]),
                xp: Number(player[8]),
                critical: weapon.crit,
                evasion: armor.evasion,

                weapon: weapon,
                armorer: armor,
                inventory: Number(player[12]),

                synergized: false
            }

            if (p.armorer.synergies) p.armorer.synergies.forEach((syn) => {
                if (syn.weapon == p.weapon.name) {
                    p.synergized = true
                    if (syn.evasion) p.evasion += p.evasion * syn.evasion
                    if (syn.critical) p.critical += syn.critical
                    if (syn.armor) p.armor += syn.armor
                    if (syn.attack) p.attack += syn.attack
                }
            })

            var embed = {
                embeds: [
                    {
                        title: p.name,
                        description: `To view your inventory, use \`/inventory\``,
                        color: fetchedUser.hexAccentColor ? parseInt(fetchedUser.hexAccentColor.replace('#', '0x')) : 0x2B2D31,
                        thumbnail: {
                            url: user.avatarURL()
                        },
                        fields: [
                            {
                                name: `\u200b`,
                                value: `__**Stats**__`,
                                inline: false
                            },
                            {
                                name: `${p.health == p.maxHealth ? '💖' : (p.health < p.maxHealth / 2 ? '❤️‍🩹' : '❤️')} ${p.health}/${p.maxHealth}`,
                                value: `Health`,
                                inline: true
                            },
                            {
                                name: `⚔️ ${p.attack}`,
                                value: `- ${p.synergized ? '__' : ''}${p.weapon.name}${p.synergized ? '__' : ''}`,
                                inline: true
                            },
                            {
                                name: `⛑ ${p.armor}`,
                                value: `- ${p.synergized ? '__' : ''}${p.armorer.name}${p.synergized ? '__' : ''}`,
                                inline: true
                            },
                            {
                                name: `💥 ${String(p.critical * 100).slice(0, 4)}%`,
                                value: 'Crit Chance',
                                inline: true
                            },
                            {
                                name: `🎯 ${String(p.accuracy * 100).slice(0, 4)}%`,
                                value: 'Accuracy',
                                inline: true
                            },
                            {
                                name: `💨 ${String(p.evasion * 100).slice(0, 4)}%`,
                                value: 'Evasion',
                                inline: true
                            },
                            {
                                name: `⚡ ${p.stamina}/${p.maxStamina}`,
                                value: 'Stamina',
                                inline: true
                            },
                            {
                                name: `\u200b`,
                                value: `__**Skills**__`,
                                inline: false
                            }
                        ],
                        footer: {
                            text: `${p.name} - Level ${p.level}\n⭐ ${p.xp}/${Math.round((p.level / 0.07) ** 2)}`,
                            icon_url: user.avatarURL()
                        }
                    }
                ],
                ephemeral: true 
            }

            weapon.skills.forEach((skill) => {
                var final = []
                if (skill.description) final.push(`${skill.description}\n`)
                if (skill.times) {
                    if (skill.damage) final.push(`Deal ⚔️${Math.round(skill.damage * 100)}% base damage ${skill.times} times`)
                    else final.push(`Hits ${skill.times} times`)
                } else if (skill.damage) final.push(`Deal ⚔️${Math.round(skill.damage * 100)}% base damage`)
                if (skill.health) final.push(`Heals ❤️${Math.round(skill.health * 100)}% health`)
                if (!skill.damage && skill.attack) final.push(`Deals basic damage`)
                if (skill.estatus) final.push(`Inflicts: \`${skill.estatus.join('')}\``)
                if (skill.pstatus) final.push(`Gains: \`${skill.pstatus.join('')}\``)
                if (final.length > 0) embed.embeds[0].fields.push({ name: `${skill.cost ? `` : `⚡`}${skill.name}${skill.cost ? ` - ⚡${skill.cost}` : ''}`, value: final.join('\n'), inline: true })
            })

            interaction.reply(embed)

        }
				else if (item) {
            var embed = {
                title: `${item.name}`,
                color: 0x2B2D31,
            }

            if (item.description) embed.description = item.description
            if (item.sprite) embed.thumbnail = { url: item.sprite }
            if (item.tier) embed.footer = { text: `Encounter Only\nKey: ${item.key}` }
            var fields = []

            if (item.armor) {
                if (!level) level = item.maxlvl || item.minlvl
                if (item.minlvl) if (level < item.minlvl) level = item.minlvl
                if (item.maxlvl) if (level > item.maxlvl) level = item.maxlvl
                embed.description = `Level ${level}\n${embed.description}`,
                // It is an armor
                embed.footer = { text: `* Varies based on player and item level` }
                fields.push({
                    name: `⛑ +${Math.round(Number(Number((await db.get(`player_${interaction.user.id}`)).split('|')[0]) * Number(item.plvlmult)) + Number(Number(level) * Number(item.alvlmult)))}*`,
                    value: `Armor`,
                    inline: true
                })

                fields.push({
                    name: `💨 ${item.evasion * 100}%`,
                    value: `Evasion`,
                    inline: true
                })

                if (item.synergies) {
                    item.synergies.forEach(sng => {
                        var syn = []
                        if (sng.critical) syn.push(`💥 +${sng.critical * 100}%`)
                        if (sng.evasion) syn.push(`💨 +${sng.evasion * 100}%`)
                        if (sng.armor) syn.push(`⛑ +${sng.armor}`)
                        if (sng.attack) syn.push(`⚔️ +${sng.attack}`)
                        fields.push({
                            name: `Synergy: ${sng.weapon}`,
                            value: `${sng.name}\n${syn.join('\n')}`,
                            inline: true
                        })
                    })
                }
            } else if (item.skills) {
                if (!level) level = item.maxlvl || item.minlvl
                if (item.minlvl) if (level < item.minlvl) level = item.minlvl
                if (item.maxlvl) if (level > item.maxlvl) level = item.maxlvl
                embed.description = `Level ${level}\n${embed.description}`
                // It is a weapon
                embed.footer = { text: `Can be levels ${item.minlvl == item.maxlvl ? item.minlvl : `${item.minlvl} - ${item.maxlvl}`}\n* Varies based on player and item level` }
                // Player Level Number((await db.get(`player_${interaction.user.id}`)).split('|')[0])
                fields = [
                    {
                        name: `⚔️ +${Math.round(Number(6 * (Number((await db.get(`player_${interaction.user.id}`)).split('|')[0]) - 1)) + Number(item.attack) + Number(level) + Number(Number((await db.get(`player_${interaction.user.id}`)).split('|')[0]) * Number(item.plvlmult)))}*`,
                        value: `Attack`,
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
                    if (!skill.damage && skill.attack) final.push(`Deals basic damage`)
                    if (skill.estatus) final.push(`Inflicts: \`${skill.estatus.join('')}\``)
                    if (skill.pstatus) final.push(`Gains: \`${skill.pstatus.join('')}\``)
                    if (final.length > 0) fields.push({ name: `${skill.cost ? `` : `⚡`}${skill.name}${skill.cost ? ` - ⚡${skill.cost}` : ''}`, value: final.join('\n'), inline: true })
                })
            } else {
                // It is an other item
                var does = []
                if (item.craft) embed.description = item.craft.join(' + ')
                if (item.health) does.push(`💗 Heals ${item.health * 100}% HP`)
                if (item.defense) does.push(`⛑ Grants +${item.defense * 100}% Armor`)
                if (item.xp) does.push(`⭐ Generates +${item.xp}% XP`)
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
                    name: "Used In:",
                    value: item.uses.join(', '),
                    inline: true
                })

                if (item.chest) fields.push({
                    name: "Unlocks Chest:",
                    value: assets.chests[item.chest - 1].name,
                    inline: true
                })

                if (item.tier) {
                    var fin = []
                    item.drops.forEach((d) => {
                        fin.push(`${d.name} - ${String(d.chance * 100).slice(0, 4)}%`)
                    })

                    fields.push({
                        name: "Drops:",
                        value: fin.join('\n'),
                        inline: true
                    })
                }
            }

            if (fields.length != 0) embed.fields = fields

            interaction.reply({
                embeds: [embed],
                ephemeral: true 
            })
        }
				else if (area) {
            if (interaction.options.getString('entity').toLocaleLowerCase().replace(/[ ]/g, '') == "eternaldamnation") return interaction.reply({
                embeds: [
                    {
                        title: "Eternal Damnation",
                        color: 0x2B2D31,
                        description: `Level 50+\n\nEternal Damnation features enemies always at your current level (minimum 50) and acts as an Endless Mode to the game. Each and every enemy has an equal oppurtunity to appear, including bosses. Good luck.`,
                        fields: [
                            {
                                name: "Enemies",
                                value: `All`
                            }
                        ]
                    }
                ],
                ephemeral: true 
            })

            let enemies = []
            area.enemies.forEach(e => {
                enemies.push(e.name)
            })

            interaction.reply({
                embeds: [
                    {
                        title: area.name,
                        color: 0x2B2D31,
                        description: `Level ${area.minlvl} - ${area.maxlvl}`,
                        fields: [
                            {
                                name: "Enemies",
                                value: enemies.join(', ')
                            }
                        ]
                    }
                ],
                ephemeral: true 
            })

        }
				else if (enemy) {
            const enemylvl = interaction.options.getInteger('level')

            if (!enemy) return interaction.reply({ content: `Hm, I can't seem to find an enemy by the name of "${interaction.options.getString('entity')}." Make sure you spelled it correctly!`, ephemeral: true })

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
                    name: `🛡️ ${enemy.maxdef ? `${Math.round(enemy.mindef * 10)}% - ${Math.round(enemy.maxdef * 10)}` : 0}%`,
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
                    name: "🗡️ Weapon",
                    value: enemy.weapon || 'None',
                    inline: true
                },
                {
                    name: `\u200b`,
                    value: `\u200b`,
                    inline: false
                }
            ]

            enemy.skills.forEach((skill) => {
                let final = [`Chance: __${Math.round(skill.chance * 100)}%__`]

                if (skill.times) {
                    if (skill.damage) final.push(`Deals ${Math.round(skill.damage * 100)}% base damage ${skill.times} times`)
                    else final.push(`Hits ${skill.times} times`)
                } else if (skill.damage) final.push(`Deals ${Math.round(skill.damage * 100)}% base damage`)
                if (skill.health) final.push(`Heals ${Math.round(skill.health * 100)}% health`)
                if (!skill.damage && skill.attack) final.push(`Deals basic damage`)
                if (skill.pstatus) final.push(`Inflicts: \`${skill.pstatus.join('')}\``)
                if (skill.estatus) final.push(`Gains: \`${skill.estatus.join('')}\``)
                fields.push({ name: `⚡${skill.name}`, value: final.join('\n'), inline: true })
            })

            let fin = []
            enemy.drops.forEach(d => {
                fin.push(`${d.name ? d.name : "Nothing"} - ${String(d.chance * 100).slice(0, 4)}%`)
            })
            fields.push({ name: `🎊 Drops`, value: fin.join('\n'), inline: true })

            interaction.reply({
                embeds: [
                    {
                        title: enemy.name,
                        color: 0x2B2D31,
                        description: `Level ${enemylvl || 1}`,
                        thumbnail: {
                            url: enemy.sprite
                        },
                        fields: fields
                    }
                ],
                ephemeral: true 
            })

        }
				else return interaction.reply({ content: `Sorry, I can't find anything, or anyone, by the name of "${interaction.options.getString("entity")}." ${interaction.options.getString("entity").includes('@') ? 'If you\'re looking for a player, you did not mention them correctly' : 'Please make sure you\'ve spelled everything correctly. If you\'re looking for a user, mention them using @user'}.`, ephemeral: true })
    }
}