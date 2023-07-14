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
                .setName('use')
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
                if (user.bot) return interaction.reply({ content: `A bot cannot, nor can I, have an inventory to start with!`, ephemeral: true })
                var player = await db.get(`player_${user.id}`)

                var embed = {
                    thumbnail: {
                        url: user.avatarURL()
                    },
                    title: `${user.username}'s Inventory`,
                    description: "Use `/inventory use <item>` to use an item from your inventory.",
                    fields: [],
                    footer: {
                        text: `Use /journal player to view your equipped items.`
                    }
                }
                player = player.split('|')

                if (!player[12]) embed.description = "Wow, such empty :3"
                else {
                    // itemIndex_itemAmount_itemLevel-itemIndex_itemAmount_itemLevel-...
                    let inv = player[12].split('-')
                    // [itemIndex_itemAmount_itemLevel, ...]
                    inv.forEach(x => {
                        let item = x.split('_')
                        let assetItem = assets.items[Number(item[0])]
                        // [itemIndex, itemAmount, itemLevel]
                        embed.fields.push({
                            name: `**${assetItem.name}** - ${item[1]}`,
                            value: `${Number(item[2]) > 0 ? `Level ${item[2]}\n` : ''}${assetItem.attack ? 'Weapon' : (assetItem.armor ? 'Armor' : '')}${assetItem.name.includes('Potion') ? 'Consumable' : ''}${(assetItem.battle ? 'Battle Item' : (!assetItem.name.includes('Potion') && !assetItem.attack && !assetItem.armor ? 'Crafting Regeant' : ''))}`,
                            inline: true
                        })
                    })
                }

                interaction.reply({ embeds: [embed] })
                break;
            }

            case 'use': {
                const item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(' ', '') == interaction.options.getString('item').toLowerCase().trim().replace(' ', ''))
                var player = await db.get(`player_${interaction.user.id}`)
                //return interaction.reply(`This is not ready yet, ${interaction.user.username}`)
                if (!item) return interaction.reply({ content: `Hm, it appears "${interaction.options.getString('item')}" is not an item!`, ephemeral: true })
                if (!player) return interaction.reply({ content: `Not only do you not have a "${interaction.options.getString('item')}", you haven't even played the game yet!`, ephemeral: true })

                player = player.split('|')
                var rawWeapon = player[9].split('_')
                var rawArmor = player[10].split('_')
                let level = Number(player[0])
                var chatLog = []
                var p = {
                    name: interaction.member.nickname || interaction.member.displayName || interaction.user.username,
                    level: level,

                    maxHealth: Math.round(Number(player[1])),
                    health: Math.round(Number(player[2])),

                    maxStamina: Math.round(Number(player[5])),
                    stamina: Math.round(Number(player[6])),

                    baseAttack: Number(player[3]),
                    baseArmor: Number(player[4]),

                    accuracy: Number(player[7]),
                    xp: Number(player[8]),

                    inventory: player[12],
                }

                var used = false
                var inv = p.inventory.split('-')
                for (i = 0; i < inv.length; i++) {
                    let invitem = inv[i].split('_')
                    var getitem = assets.items[invitem[0]]
                    if (getitem.name == item.name) {
                        if (item.attack) {
                            let currentWeapon = rawWeapon.join('_')
                            rawWeapon = inv[i]
                            inv[i] = currentWeapon
                            chatLog.push(`equipped the ${item.name} weapon`)
                        } else if (item.armor) {
                            let currentArmor = rawArmor.join('_')
                            rawArmor = inv[i]
                            inv[i] = currentArmor
                            chatLog.push(`equipped the ${item.name} armor`)
                        } else {
                            if (getitem.stamina) {
                                let add = Math.round(p.maxStamina * getitem.stamina)
                                if (add + p.stamina > p.maxStamina) add = p.maxStamina - p.stamina
                                p.stamina += add
                                invitem[1] = Number(invitem[1]) - 1
                                chatLog.push(`gained ${add} stamina`)
                                used = true;
                            }

                            if (getitem.health) {
                                let add = Math.round(p.maxHealth * getitem.health)
                                if (add + p.health > p.maxHealth) add = p.maxHealth - p.health
                                p.health += add
                                invitem[1] = Number(invitem[1]) - 1
                                chatLog.push(`gained ${add} health`)
                                used = true;
                            }

                            if (getitem.defense) {
                                p.baseArmor += Math.round(p.baseArmor * getitem.defense)
                                invitem[1] = Number(invitem[1]) - 1
                                chatLog.push(`gained ${add} defense`)
                                used = true;
                            }

                            if (getitem.buff) {
                                p.baseAttack += Math.round(p.baseAttack * getitem.buff)
                                invitem[1] = Number(invitem[1]) - 1
                                chatLog.push(`gained ${add} attack`)
                                used = true;
                            }

                            if (getitem.xp) {
                                let add = Math.round(getitem.xp)
                                var exp = add
                                while (exp > 0) {
                                    if (exp >= (Math.round((p.level / 0.07) ** 2) - p.xp)) {
                                        p.level += 1
                                        p.maxHealth = Math.round(Number(player[1]) + (50 * (p.level - 1)))
                                        p.health = p.health + (50 * (p.level - 1))
                                        p.maxStamina = Math.round(Number(player[5]) + (5 * (p.level - 1)))
                                        p.stamina = p.stamina + (5 * (p.level - 1))
                                        p.baseAttack = Math.round(Number(player[3]) + (6 * (p.level - 1)))
                                        p.baseArmor = Math.round(Number(player[4]) + (10 * (p.level - 1)))
                                        exp -= (Math.round((p.level / 0.07) ** 2) - p.xp)
                                        p.xp = 0
                                    } else {
                                        p.xp += exp
                                        exp -= exp
                                    }
                                }
                                invitem[1] = Number(invitem[1]) - 1
                                chatLog.push(`gained ${add} xp`)
                                used = true;
                            }
                        }

                        if (Number(invitem[1]) > 0) inv[i] = invitem.join('_')
                        else inv.splice(i, 1)
                        await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${inv ? `|${inv.join('-')}` : ''}`)
                        break;
                    }
                }

                if (!used) return interaction.reply({ content: `That item (${item.name}) cannot be used!`, ephemeral: true })
                else interaction.reply({
                    embeds: [
                        {
                            title: "Item used!",
                            thumbnail: {
                                url: interaction.user.avatarURL()
                            },
                            description: `**${interaction.user.username}** used **${item.name}**:\n\n${interaction.user.username} **${chatLog.join(' and ')}!**`
                        }
                    ]
                })
                break;
            }
        }
    }
}