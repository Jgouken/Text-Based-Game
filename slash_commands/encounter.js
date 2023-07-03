const { SlashCommandBuilder } = require('discord.js');
const battling = require('./battling.js');
const assets = require('./assets.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('encounter')
		.setDescription('TEST COMMAND. Initiate an encounter.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('enemy')
				.setDescription('Encounter a specific enemy at their base or specified level')
				.addStringOption(option =>
					option.setName('enemy')
						.setDescription('The enemy to encounter')
						.setRequired(false)
						.addChoices(
							{ name: 'Lazy Goblin', value: '0' },
							{ name: 'Blacksmith Goblin', value: '1' },
							{ name: 'Armorer Goblin', value: '2' },
							{ name: 'Cursed Goblin', value: '3' },
							{ name: 'Orc', value: '4' },
							{ name: 'Health Slime', value: '5' },
							{ name: 'Attack Slime', value: '6' },
							{ name: 'Defense Slime', value: '7' },
							{ name: 'Stamina Slime', value: '8' },
							{ name: 'Orange Fox', value: '9' },
							{ name: 'White Fox', value: '10' },
							{ name: 'Blue Fox', value: '11' },
							{ name: 'Vampire', value: '12' },
							{ name: 'Demon', value: '13' },
							{ name: 'Werewolf', value: '14' },
							{ name: 'Witch', value: '15' },
							{ name: 'Cow', value: '16' },
							{ name: 'Sheep', value: '17' },
							{ name: 'Chicken', value: '18' },
							{ name: 'Cyclops Overlord', value: '19' },
							{ name: 'Fox King', value: '20' },
							{ name: 'Goblin King', value: '21' },
							{ name: 'Demon Queen', value: '22' },
						)
				)
				.addStringOption(option =>
					option.setName('armor')
						.setDescription('The armor to wear')
						.setRequired(false)
						.addChoices(
							{ name: 'None', value: '0' },
							{ name: 'Tattered Rags', value: '1' },
							{ name: 'Damaged Cloak', value: '2' },
							{ name: 'Rogues Cloak', value: '3' },
							{ name: 'Perfect Leaf', value: '4' },
							{ name: 'Padded Clothing', value: '5' },
							{ name: 'Confidence', value: '6' },
							{ name: 'Leather Armor', value: '7' },
							{ name: 'Light Armor', value: '8' },
							{ name: 'Hunter Cloak', value: '9' },
							{ name: 'Assassin\'s Cloak', value: '10' },
							{ name: 'Lumberjack Atire', value: '11' },
							{ name: 'Thick Sleeveless Hoodie', value: '12' },
							{ name: 'Leather Apron & Mask', value: '13' },
							{ name: 'Iron Armor', value: '14' },
							{ name: 'Dragon Cloak', value: '15' },
							{ name: 'Spiked Leather Armor', value: '16' },
							{ name: 'Shinobi Garments', value: '17' },
							{ name: 'Holy Knight\'s Armor', value: '18' },
							{ name: 'Coat of Darkness', value: '19' },
							{ name: 'Blessed GI', value: '20' },
							{ name: 'Sinner Jacket', value: '21' },
							{ name: 'Walking Church', value: '22' },
							{ name: 'Black Mourning', value: '23' },
							{ name: 'Equinox', value: '24' },
						)
				)
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
						.setDescription('Boss weapon to use')
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
				.addIntegerOption(option =>
					option.setName('level')
						.setDescription('The level of the player')
						.setMinValue(1)
            			.setMaxValue(50)
						.setRequired(false)
				)
				.addIntegerOption(option =>
					option.setName('enemylvl')
						.setDescription('The level of the enemy')
						.setMinValue(1)
            			.setMaxValue(50)
						.setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('area')
				.setDescription('Go to an area and encounter certain enemies')
				.addStringOption(option =>
					option.setName('area')
						.setDescription('The area to go to')
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
				.addStringOption(option =>
					option.setName('armor')
						.setDescription('The armor to wear')
						.setRequired(false)
						.addChoices(
							{ name: 'None', value: '0' },
							{ name: 'Tattered Rags', value: '1' },
							{ name: 'Damaged Cloak', value: '2' },
							{ name: 'Rogues Cloak', value: '3' },
							{ name: 'Perfect Leaf', value: '4' },
							{ name: 'Padded Clothing', value: '5' },
							{ name: 'Confidence', value: '6' },
							{ name: 'Leather Armor', value: '7' },
							{ name: 'Light Armor', value: '8' },
							{ name: 'Hunter Cloak', value: '9' },
							{ name: 'Assassin\'s Cloak', value: '10' },
							{ name: 'Lumberjack Atire', value: '11' },
							{ name: 'Thick Sleeveless Hoodie', value: '12' },
							{ name: 'Leather Apron & Mask', value: '13' },
							{ name: 'Iron Armor', value: '14' },
							{ name: 'Dragon Cloak', value: '15' },
							{ name: 'Spiked Leather Armor', value: '16' },
							{ name: 'Shinobi Garments', value: '17' },
							{ name: 'Holy Knight\'s Armor', value: '18' },
							{ name: 'Coat of Darkness', value: '19' },
							{ name: 'Blessed GI', value: '20' },
							{ name: 'Sinner Jacket', value: '21' },
							{ name: 'Walking Church', value: '22' },
							{ name: 'Black Mourning', value: '23' },
							{ name: 'Equinox', value: '24' },
						)
				)
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
							{ name: 'Wodden Bow', value: '12' },
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
						.setDescription('Boss weapon to use')
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
				.addIntegerOption(option =>
					option.setName('level')
						.setDescription('The level of the player')
						.setMinValue(1)
            			.setMaxValue(50)
						.setRequired(false)
				)
		),

	async execute(bot, interaction, db) {
		var area = false
		if (interaction.options.getSubcommand() === 'area') area = true
		if (Number(interaction.options.getString('area') == 10)) return interaction.reply({content: "For eternal damnation, use the `/encounter enemy` command. As of currently, however, it is of any level that you choose.", ephemeral: true})
		var choice = Number(interaction.options.getString('enemy')) || Number(interaction.options.getString('area'))
		var weapon = Number(interaction.options.getString('weapon')) || Number(interaction.options.getString('bossweapon'))
		var armor = Number(interaction.options.getString('armor'))
		var level = interaction.options.getInteger('level')
		var enemylvl = interaction.options.getInteger('enemylvl')
		battling.execute(bot, interaction, db, weapon, armor, level, choice, area, enemylvl, assets)
	}
}