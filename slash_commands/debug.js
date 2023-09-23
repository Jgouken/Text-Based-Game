const { SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js');
const inventory = require('./inventory.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription(`Do an action regarding your inventory.`)
        .addSubcommand(subcommand =>
            subcommand
                .setName('level')
                .setDescription(`Set your player level.`)
                .addIntegerOption(option =>
                    option.setName('level')
                        .setDescription('Choose a level to set it as.')
                        .setMaxValue(100)
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('xp')
                .setDescription(`Set your player level.`)
                .addIntegerOption(option =>
                    option.setName('xp')
                        .setDescription('Add an amount of xp to yourself.')
                        .setMaxValue(99999999)
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('refill')
                .setDescription(`Refill your health and stamina.`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('armor')
                .setDescription(`Set the armor that you're strutting around with.`)
                .addStringOption(option =>
                    option.setName('armor')
                        .setDescription('The armor to wear')
                        .setRequired(true)
                        .addChoices(
                            { name: 'T-Shirt', value: '31' },
                            { name: 'Tattered Rags', value: '32' },
                            { name: 'Damaged Cloak', value: '33' },
                            { name: 'Rogues Cloak', value: '34' },
                            { name: 'Perfect Leaf', value: '35' },
                            { name: 'Padded Clothing', value: '36' },
                            { name: 'Confidence', value: '37' },
                            { name: 'Leather Armor', value: '38' },
                            { name: 'Light Armor', value: '39' },
                            { name: 'Hunter Cloak', value: '40' },
                            { name: 'Assassin\'s Cloak', value: '41' },
                            { name: 'Lumberjack Atire', value: '42' },
                            { name: 'Thick Sleeveless Hoodie', value: '43' },
                            { name: 'Leather Apron & Mask', value: '44' },
                            { name: 'Iron Armor', value: '45' },
                            { name: 'Dragon Cloak', value: '46' },
                            { name: 'Spiked Leather Armor', value: '47' },
                            { name: 'Shinobi Garments', value: '48' },
                            { name: 'Holy Knight\'s Armor', value: '49' },
                            { name: 'Coat of Darkness', value: '50' },
                            { name: 'Blessed GI', value: '51' },
                            { name: 'Sinner Jacket', value: '52' },
                            { name: 'Walking Church', value: '53' },
                            { name: 'Black Mourning', value: '54' },
                            { name: 'Equinox', value: '55' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('weapon')
                .setDescription(`Set the weapon that you're brandishing over the top of all of the enemies.`)
                .addStringOption(option =>
                    option.setName('weapon')
                        .setDescription('The weapon to use')
                        .setRequired(false)
                        .addChoices(
                            { name: '2-Piece No Sauce', value: '0' },
                            { name: 'Twig', value: '1' },
                            { name: 'Branch', value: '2' },
                            { name: 'Broken Dagger', value: '3' },
                            { name: 'Rusty Dagger', value: '4' },
                            { name: 'Trusty Dagger', value: '5' },
                            { name: 'The Perfect Stick', value: '6' },
                            { name: 'Iron Short Sword', value: '7' },
                            { name: 'Golden Stick', value: '8' },
                            { name: 'Dual Daggers', value: '9' },
                            { name: 'Dual Hatchets', value: '10' },
                            { name: 'Iron Sword', value: '11' },
                            { name: 'Wooden Bow', value: '12' },
                            { name: 'Lumberjack Axe', value: '13' },
                            { name: 'Silver Knife', value: '14' },
                            { name: 'Martial Arts', value: '15' },
                            { name: 'Chainsaw', value: '16' },
                            { name: 'Great Sword', value: '17' },
                            { name: 'Skull Crusher', value: '18' },
                            { name: 'Twin Swords', value: '19' },
                            { name: 'Spiked Gauntlets', value: '20' },
                            { name: 'Ninja Arts', value: '21' },
                        )
                )
                .addStringOption(option =>
                    option.setName('bossweapon')
                        .setDescription('The boss weapon to use')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Holy Spear', value: '22' },
                            { name: 'Cursed Bone Bow', value: '23' },
                            { name: 'Cursed Fangs', value: '24' },
                            { name: 'Evil Pulverizer', value: '25' },
                            { name: 'Denomic Nunchucks', value: '26' },
                            { name: 'Holy Arts', value: '27' },
                            { name: 'Orcus', value: '28' },
                            { name: 'Iris & Hermes', value: '29' },
                            { name: 'Alectrona & Melanie', value: '30' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('item')
                .setDescription('Add an item into your inventory.')
                .addStringOption(option =>
                    option.setName('item')
                        .setDescription('Type out the name of an item. Not case sensitive.')
                        .setRequired(true)
                )
        ),

    async execute(bot, interaction, db) {
        switch (interaction.options.getSubcommand()) {
            case 'level': {
                let player = (await db.get(`player_${interaction.user.id}`)).split('|')
                let rawWeapon = player[9].split('_')
                let rawArmor = player[10].split('_')
                let weapon = assets.items[Number(rawWeapon[0])]
                let armor = assets.items[Number(rawArmor[0])]
                let level = Number(player[0])

                var p = {
                    level: level,

                    maxHealth: Math.round(Number(player[1])),
                    health: Math.round(Number(player[2])),

                    maxStamina: Math.round(Number(player[5])),
                    stamina: Math.round(Number(player[6])),

                    baseAttack: Number(player[3]),
                    baseArmor: Number(player[4]),

                    accuracy: Number(player[7]),
                    xp: Number(player[8]),
                    critical: weapon.crit,
                    evasion: armor.evasion,

                    inventory: player[12],
                }

                p.level = Number(interaction.options.getInteger('level'))
                p.maxHealth = Math.round(500 + (50 * (p.level - 1)))
                p.maxStamina = Math.round(50 + (5 * (p.level - 1)))
                p.baseAttack = Math.round(30 + (6 * (p.level - 1)))
                p.baseArmor = Math.round(10 + (10 * (p.level - 1)))
                p.health = p.maxHealth
                p.stamina = p.maxStamina

                if (p.health > p.maxHealth) p.health = p.maxHealth
                if (p.stamina > p.maxStamina) p.stamina = p.maxStamina

                await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${p.inventory ? `|${p.inventory}` : ''}`)
                interaction.reply({ content: `Your level has been set to level ${p.level}.`, ephemeral: true })
                break;
            }

            case 'xp': {
                let player = (await db.get(`player_${interaction.user.id}`)).split('|')
                let rawWeapon = player[9].split('_')
                let rawArmor = player[10].split('_')
                let weapon = assets.items[Number(rawWeapon[0])]
                let armor = assets.items[Number(rawArmor[0])]
                let level = Number(player[0])
                var p = {
                    level: level,

                    maxHealth: Math.round(Number(player[1])),
                    health: Math.round(Number(player[2])),

                    maxStamina: Math.round(Number(player[5])),
                    stamina: Math.round(Number(player[6])),

                    baseAttack: Number(player[3]),
                    baseArmor: Number(player[4]),

                    accuracy: Number(player[7]),
                    xp: Number(player[8]),
                    critical: weapon.crit,
                    evasion: armor.evasion,

                    inventory: player[12],
                }

                p.xp += Number(interaction.options.getInteger('xp'))
                while (p.xp >= Math.round((p.level / 0.07) ** 2)) {
                    p.xp -= Math.round((p.level / 0.07) ** 2)
                    p.level += 1
                    p.maxHealth = Math.round(Number(player[1]) + (50 * (p.level - 1)))
                    p.health = p.maxHealth
                    p.maxStamina = Math.round(Number(player[5]) + (5 * (p.level - 1)))
                    p.stamina = p.maxStamina
                    p.baseAttack = Math.round(Number(player[3]) + (6 * (p.level - 1)))
                    p.baseArmor = Math.round(Number(player[4]) + (10 * (p.level - 1)))
                }

                await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${p.inventory ? `|${p.inventory}` : ''}`)
                interaction.reply({ content: `You have gained ${Number(interaction.options.getInteger('xp'))} and are level ${p.level}.`, ephemeral: true })
                break;
            }

            case 'refill': {
                let player = (await db.get(`player_${interaction.user.id}`)).split('|')
                let rawWeapon = player[9].split('_')
                let rawArmor = player[10].split('_')
                let weapon = assets.items[Number(rawWeapon[0])]
                let armor = assets.items[Number(rawArmor[0])]
                let level = Number(player[0])
                var p = {
                    level: level,

                    maxHealth: Math.round(Number(player[1])),
                    health: Math.round(Number(player[2])),

                    maxStamina: Math.round(Number(player[5])),
                    stamina: Math.round(Number(player[6])),

                    baseAttack: Number(player[3]),
                    baseArmor: Number(player[4]),

                    accuracy: Number(player[7]),
                    xp: Number(player[8]),
                    critical: weapon.crit,
                    evasion: armor.evasion,

                    inventory: player[12],
                }

                p.xp += Number(interaction.options.getInteger('xp'))
                while (p.xp >= Math.round((p.level / 0.07) ** 2)) {
                    p.xp -= Math.round((p.level / 0.07) ** 2)
                    p.level += 1
                    p.maxHealth = Math.round(Number(player[1]) + (50 * (p.level - 1)))
                    p.health = p.maxHealth
                    p.maxStamina = Math.round(Number(player[5]) + (5 * (p.level - 1)))
                    p.stamina = p.maxStamina
                    p.baseAttack = Math.round(Number(player[3]) + (6 * (p.level - 1)))
                    p.baseArmor = Math.round(Number(player[4]) + (10 * (p.level - 1)))
                }

                await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${p.inventory ? `|${p.inventory}` : ''}`)
                interaction.reply({ content: `You have gained ${Number(interaction.options.getInteger('xp'))} and are level ${p.level}.`, ephemeral: true })
                break;
            }

            case 'armor': {
                var player = await db.get(`player_${interaction.user.id}`)
                player = player.split('|')
                let item = assets.items[Number(interaction.options.getString('armor'))]
                player[10] = `${interaction.options.getString('armor')}_1_${item.maxlvl || item.minlvl}`

                await db.set(`player_${interaction.user.id}`, player.join('|'))
                interaction.reply({ content: `Your armor has been set to ${item.name}.`, ephemeral: true })
                break;
            }

            case 'weapon': {
                if (!interaction.options.getString('weapon') && !interaction.options.getString('bossweapon')) return interaction.reply({ content: `Please select either a weapon or boss weapon.`, ephemeral: true })

                var player = await db.get(`player_${interaction.user.id}`)
                player = player.split('|')
                let item = assets.items[Number(interaction.options.getString('weapon') || interaction.options.getString('bossweapon'))]
                player[9] = `${interaction.options.getString('weapon') || interaction.options.getString('bossweapon')}_1_${item.maxlvl || item.minlvl}`

                await db.set(`player_${interaction.user.id}`, player.join('|'))
                interaction.reply({ content: `Your weapon has been set to ${item.name}.`, ephemeral: true })
                break;
            }

            case 'item': {
                let item = assets.items.find(({ name }) => name.toLowerCase().trim().replace(/[ ]/, '') == interaction.options.getString('item').toLowerCase().trim().replace(/[ ]/, ''))
                if (!item) return interaction.reply({ content: `Hm, I can't seem to add an item called "${interaction.options.getString('item')}". Ensure you've spelled everything correctly!`, ephemeral: true})
                db.set(`player_${interaction.user.id}`, await inventory.player.add(await db.get(`player_${interaction.user.id}`), item.name))
                interaction.reply({ content: `Added the item ${item.name} into your inventory!`, ephemeral: true })
                break;
            }
        }
    }
}