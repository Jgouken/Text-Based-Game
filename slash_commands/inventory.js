const { SlashCommandBuilder } = require('discord.js');
const { db } = require('../config/config.js')
const assets = require('./assets.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription(`View, or use an item from, your inventory.`)
        .addStringOption(option =>
            option.setName('use')
                .setDescription('Type out the name of an item AND USE IT. Not case sensitive.')
                .setRequired(false)
        ),

    async execute(bot, interaction, db) {
        var item = interaction.options.getString('use')
        if (item) item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/g, '') == item.toLowerCase().trim().replace(/[ ]/g, ''))

        if (interaction.options.getString('use')) {
            var player = await db.get(`player_${interaction.user.id}`)
            if (!item) return interaction.reply({ content: `Hm, it appears "${interaction.options.getString('use')}" is not an item!`, ephemeral: true })
            player = player.split('|')
            var rawWeapon = player[9].split('_')
            var rawArmor = player[10].split('_')
            var level = Number(player[0])
            var used = false
            var found = false
            var final = []
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

            var inv = p.inventory.split('-')

            // EACH ITEM FULL
            for (i = 0; i < inv.length; i++) {
                var invitem = inv[i].split('_')
                // INDIVIDUAL ATTRIBUTES
                var getitem = assets.items[invitem[0]]
                if (getitem.name == item.name) {
                    found = true
                    if (item.attack) {
                        let previousWeapon = rawWeapon
                        rawWeapon = invitem
                        invitem = previousWeapon
                        chatLog.push(`equipped the ${item.name} weapon`)
                        used = true;
                    } else if (item.armor) {
                        let currentArmor = rawArmor
                        rawArmor = invitem
                        invitem = currentArmor
                        chatLog.push(`equipped the ${item.name} armor`)
                        used = true;
                    } else {
                        var alreadyDone = false;
                        if (!getitem.chest && !getitem.damage) {
                            if (getitem.stamina) {
                                let add = Math.round(p.maxStamina * getitem.stamina)
                                if (add + p.stamina > p.maxStamina) add = p.maxStamina - p.stamina
                                p.stamina += add
                                if (!alreadyDone) {
                                    invitem[1] = Number(invitem[1]) - 1
                                    alreadyDone = true
                                }
                                chatLog.push(`gained ${add} stamina`)
                                used = true;
                            }

                            if (getitem.health) {
                                let add = Math.round(p.maxHealth * getitem.health)
                                if (add + p.health > p.maxHealth) add = p.maxHealth - p.health
                                p.health += add
                                if (!alreadyDone) {
                                    invitem[1] = Number(invitem[1]) - 1
                                    alreadyDone = true
                                }
                                chatLog.push(`gained ${add} health`)
                                used = true;
                            }

                            if (getitem.defense) {
                                chatLog.push(`gained ${Math.round(p.baseArmor * getitem.defense)} defense`)
                                p.baseArmor += Math.round(p.baseArmor * getitem.defense)
                                if (!alreadyDone) {
                                    invitem[1] = Number(invitem[1]) - 1
                                    alreadyDone = true
                                }
                                used = true;
                            }

                            if (getitem.buff) {
                                chatLog.push(`gained ${Math.round(p.baseAttack * getitem.buff)} attack`)
                                p.baseAttack += Math.round(p.baseAttack * getitem.buff)
                                if (!alreadyDone) {
                                    invitem[1] = Number(invitem[1]) - 1
                                    alreadyDone = true
                                }
                                used = true;
                            }

                            if (getitem.xp) {
                                var exp = Math.round(getitem.xp)
                                chatLog.push(`gained ${Math.round(exp)} xp`)
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
                                if (!alreadyDone) {
                                    invitem[1] = Number(invitem[1]) - 1
                                    alreadyDone = true
                                }
                                used = true;
                            }
                        }
                    }
                }

                if (Number(invitem[1]) > 0) final.push(invitem.join('_'))
            }

            if (!found) return interaction.reply({ content: `You do not own ${item.name.split('')[0].match(/\A[^aeiouAEIOU]/) ? 'an' : 'a'} ${item.name}.`, ephemeral: true })
            if (!used) return interaction.reply({ content: `That item (${item.name}) cannot be used. ${item.damage ? 'That item can only be used in combat.' : (item.uses ? 'That is a crafting reagent.' : (item.chest ? 'That is a key, which can only be used at a chest.' : 'This item is currently useless.'))}`, ephemeral: true })
            else await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${final ? `|${final.join('-')}` : ''}`)

            interaction.reply({
                embeds: [
                    {
                        title: "Item used!",
                        color: 0x2B2D31,
                        thumbnail: {
                            url: item.sprite || interaction.user.avatarURL()
                        },
                        description: `**${interaction.user.username}** used **${item.name}**:\n\n${interaction.user.username} **${chatLog.join(' and ')}!**`
                    }
                ], ephemeral: true
            })
        } else {
            const fetchedUser = interaction.user.fetch(true)
            var player = await db.get(`player_${interaction.user.id}`)
            console.log(player)
            var embed = {
                thumbnail: {
                    url: interaction.user.avatarURL()
                },
                title: `${interaction.user.username.toLocaleUpperCase()}'s Inventory`,
                color: fetchedUser.hexAccentColor ? parseInt(fetchedUser.hexAccentColor.replace('#', '0x')) : 0x2B2D31,
                description: "Use `/inventory (item)` to use an item from your inventory.",
                fields: [],
                footer: {
                    text: `Use /journal to view your equipped items.`
                }
            }

            player = player.split('|')

            if (!player[12]) embed.description = "Wow, such empty :3"
            else {
                // itemIndex_itemAmount_itemLevel-itemIndex_itemAmount_itemLevel-...
                let inv = player[12].split('-')
                // [itemIndex_itemAmount_itemLevel, ...]
                inv.forEach(x => {
                    let itemm = x.split('_')
                    let assetItem = assets.items[Number(itemm[0])]
                    // [itemIndex, itemAmount, itemLevel]
                    embed.fields.push({
                        name: `${assetItem.emoji ? `${assetItem.emoji} ` : ''}**${assetItem.name}** - ${itemm[1]}`,
                        value: (`${Number(itemm[2]) > 0 ? `Level ${itemm[2]}\n` : ''}${assetItem.attack ? 'Weapon' : (assetItem.armor ? 'Armor' : '')}${assetItem.name.includes('Potion') ? 'Consumable' : ''}${assetItem.chest ? 'Chest Key' : ''}${(assetItem.battle ? '\nBattle Item' : (!assetItem.name.includes('Potion') && !assetItem.attack && !assetItem.armor && !assetItem.chest ? 'Reagent' : ''))}`).trim(),
                        inline: true
                    })
                })
            }

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    },

    player: {
        add: async function (userdb, itemName, level) {
            if (!itemName) return console.error(`Cannot add an undefined item.`);
            let item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/, '') == itemName.toLowerCase().trim().replace(/[ ]/, ''))
            var player = await userdb
            var i = 0

            if (!item) return console.error(`"${itemName}" does not exist`);
            if (!player || typeof player != "string") return console.error(`This Player Database (${userdb}) does not exist.`);
            var changed = false

            player = player.split('|')
            if (player[12]) player[12] = (player[12]).split('-')
            else player[12] = []

            player[12].forEach((playeri) => {
                if (playeri.startsWith(`${assets.items.indexOf(item)}_`) && playeri.endsWith(`_${level || item.maxlvl || item.minlvl || "0"}`)) {
                    player[12][i] = `${assets.items.indexOf(item)}_${Number(playeri.split('_')[1]) + 1}_${level || item.maxlvl || item.minlvl || "0"}`
                    changed = true;
                    return;
                }
                i++
            })

            if (!changed) player[12].push(`${assets.items.indexOf(item)}_1_${level || item.maxlvl || item.minlvl || "0"}`)
            player[12] = player[12].join('-')
            console.log(`Returning ${player.join('|')}`)
            return player.join('|');
        },

        remove: async function (userdb, itemName, level) {
            if (!itemName) return console.error(`Cannot remove an undefined item.`);
            var player = await userdb
            if (!player || typeof player != "string") return console.error(`This Player Database (${userdb}) does not exist.`);
            player = player.split('|')
            if (player[12]) player[12] = (player[12]).split('-')
            else return console.log(`Player inventory is empty.`)

            if (typeof itemName === "string") {
                var final = []
                let item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/, '') == itemName.toLowerCase().trim().replace(/[ ]/, ''))
                if (!item) return console.error(`"${itemName}" does not exist`);
                player[12].forEach((playeri) => {
                    if (playeri.startsWith(`${assets.items.indexOf(item)}_`) && (Number(level) ? playeri.endsWith(`_${level}`) : true)) {
                        if (Number(playeri.split('_')[1]) > 1) final.push(`${assets.items.indexOf(item)}_${Number(playeri.split('_')[1]) - 1}_${level || "0"}`)
                    } else {
                        final.push(playeri)
                    }
                })

                player[12] = final
            } else {
                // Array of items
                var item = []
                var stop = false
                itemName.forEach(i => {
                    if (stop === true) return;
                    assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/, '') == i.toLowerCase().trim().replace(/[ ]/, '')) ? item.push(assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/, '') == i.toLowerCase().trim().replace(/[ ]/, ''))) : stop = true;
                })
                if (stop === true) return console.error(`Cannot remove an undefined item.`);
                item.forEach((ite) => {
                    var final = player[12]
                    final.forEach((playeri) => {
                        if (playeri.startsWith(`${assets.items.indexOf(ite)}_`) && (Number(level) ? playeri.endsWith(`_${level}`) : true)) {
                            if (Number(playeri.split('_')[1]) > 1) final.push(`${assets.items.indexOf(ite)}_${Number(playeri.split('_')[1]) - 1}_${level || "0"}`)
                        } else {
                            final.push(playeri)
                        }
                    })

                    player[12] = final
                })
            }

            return player.join('|')
        },

        search: async function (userdb, itemName, level) {
            if (!itemName) return console.error(`Cannot search for an undefined item.`);
            let item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/, '') == itemName.toLowerCase().trim().replace(/[ ]/, ''))
            var player = await userdb
            var hasItem = false;

            if (!item) return console.error(`"${itemName}" does not exist.`);
            if (!player || typeof player != "string") return console.error(`This Player Database (${userdb}) does not exist.`);

            player = player.split('|')
            if (player[12]) player[12] = (player[12]).split('-')
            else player[12] = []
            player[12].forEach((playeri) => {
                let minii = playeri.split('_')
                if (Number(minii[0]) == assets.items.indexOf(item) && (Number(level) ? (Number(minii[2]) == level) : true)) {
                    hasItem = minii
                    return;
                }
            })

            return hasItem || false;
        },
    }
}