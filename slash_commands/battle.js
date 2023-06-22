const { SlashCommandBuilder } = require('discord.js');
const battling = require('./battling.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('battle')
		.setDescription('TEST COMMAND. Initiate a battle.')
		.addStringOption(option =>
			option.setName('enemy')
				.setDescription('The enemy to encounter')
				.setRequired(false)
				.addChoices(
					{ name: 'Lazy Goblin', value: '1' },
					{ name: 'Blacksmith Goblin', value: '2' },
					{ name: 'Armorer Goblin', value: '3' },
					{ name: 'Cursed Goblin', value: '4' },
					{ name: 'Orc', value: '5' },
					{ name: 'Health Slime', value: '6' },
					{ name: 'Attack Slime', value: '7' },
					{ name: 'Defense Slime', value: '8' },
					{ name: 'Stamina Slime', value: '9' },
					{ name: 'Orange Fox', value: '10' },
					{ name: 'White Fox', value: '11' },
					{ name: 'Blue Fox', value: '12' },
					{ name: 'Vampire', value: '13' },
					{ name: 'Demon', value: '14' },
					{ name: 'Werewolf', value: '15' },
					{ name: 'Witch', value: '16' },
					{ name: 'Cow', value: '17' },
					{ name: 'Sheep', value: '18' },
					{ name: 'Chicken', value: '19' },
					{ name: 'Cyclops Overlord', value: '20' },
					{ name: 'Fox King', value: '21' },
					{ name: 'Goblin King', value: '22' },
					{ name: 'Demon Queen', value: '23' },
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
				))
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
		.addStringOption(option =>
			option.setName('level')
				.setDescription('The level of the player')
				.setRequired(false)
		),

	async execute(bot, interaction, db) {
		var enemy = Number(interaction.options.getString('enemy')) - 1
		var weapon = Number(interaction.options.getString('weapon')) || Number(interaction.options.getString('bossweapon'))
		var armor = Number(interaction.options.getString('armor'))
		var level = interaction.options.getString('level')
		if (level < 0) level = level * -1
		if (level > 50) level = 50
		battling.execute(bot, interaction, db, enemy, weapon, armor, level)
	}
}