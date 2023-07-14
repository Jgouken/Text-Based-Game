let mult = 9

module.exports = {
	statuses: [
		{
			name: 'Fatal Poison',
			id: '💀',
			description: `Inflict 5% max HP damage for 3 turns.`,
			positive: false,
			length: 3,
			use: async function (EorP, statuses, currentHealth, chatLog, name, emaxHealth) {
				let status = statuses.find(({ id }) => id == this.id)
				var crit = 1
				if (Math.random() * 100 < 5) crit = 1.6
				currentHealth = Math.round(currentHealth - ((EorP.armor ? EorP.maxHealth : emaxHealth) * 0.05 * crit))
				chatLog.push(`${name} is posioned - ${crit == 2 ? 'CRITICAL ' : ''}💀${Math.round((EorP.armor ? EorP.maxHealth : emaxHealth) * 0.05 * crit)}`)
				status.length = status.length -= 1
				if (status.length == 0) statuses.splice(statuses.indexOf(status), 1)
				return {
					EorP: EorP,
					statuses: statuses,
					currentHealth: currentHealth,
					chatLog: chatLog,
					name: name
				};
			}
		},
		{
			name: 'Regeneration',
			id: '💗',
			description: `Gain 5% max HP for 6 turns.`,
			positive: true,
			length: 6,
			use: async function (EorP, statuses, currentHealth, chatLog, name, emaxHealth) {
				let status = statuses.find(({ id }) => id == this.id)
				var crit = 1
				if (Math.random() * 100 < 5) crit = 1.6
				var heal = Math.round((EorP.armor ? EorP.maxHealth : emaxHealth) * 0.05 * crit)
				if (currentHealth + heal > (EorP.armor ? EorP.maxHealth : emaxHealth)) heal = (EorP.armor ? EorP.maxHealth : emaxHealth) - currentHealth
				currentHealth += heal
				chatLog.push(`${name} has regeneration - ${crit == 2 ? 'CRITICAL ' : ''}💗${heal}`)
				status.length = status.length -= 1
				if (status.length == 0) statuses.splice(statuses.indexOf(status), 1)
				return {
					EorP: EorP,
					statuses: statuses,
					currentHealth: currentHealth,
					chatLog: chatLog,
					name: name
				};
			}
		},
		{
			name: 'Bleed',
			id: '🩸',
			description: `Inflict 15% of initial damage for 3 turns.`,
			positive: false,
			length: 3,
			use: async function (EorP, statuses, currentHealth, chatLog, name, emaxHealth) {
				let status = statuses.find(({ id }) => id == this.id)
				var crit = 1
				if (Math.random() * 100 < 5) crit = 1.6
				currentHealth = Math.round(currentHealth - (status.damage * 0.15 * crit))
				chatLog.push(`${name} is bleeding - ${crit == 2 ? 'CRITICAL ' : ''}🩸${Math.round(status.damage * 0.15 * crit)}`)
				status.length = status.length -= 1
				if (status.length == 0) statuses.splice(statuses.indexOf(status), 1)
				return {
					EorP: EorP,
					statuses: statuses,
					currentHealth: currentHealth,
					chatLog: chatLog,
					name: name
				};
			}
		},
		{
			name: 'Burn',
			id: '🔥',
			description: `Inflict 5% of initial damage for 10 turns.`,
			positive: false,
			length: 3,
			use: async function (EorP, statuses, currentHealth, chatLog, name, emaxHealth) {
				let status = statuses.find(({ id }) => id == this.id)
				var crit = 1
				if (Math.random() * 100 < 5) crit = 1.6
				currentHealth = Math.round(currentHealth - (status.damage * 0.05 * crit))
				chatLog.push(`${name} is burned - ${crit == 2 ? 'CRITICAL ' : ''}🔥${Math.round(status.damage * 0.05 * crit)}`)
				status.length = status.length -= 1
				if (status.length == 0) statuses.splice(statuses.indexOf(status), 1)
				return {
					EorP: EorP,
					statuses: statuses,
					currentHealth: currentHealth,
					chatLog: chatLog,
					name: name
				};
			}
		},
		{
			name: 'Weakness',
			id: '🌀',
			description: `Deal 25% less damage for 3 turns.`,
			positive: false,
			length: 3
		},
		{
			name: 'Strength',
			id: '💪',
			description: `Deal 15% more damage for 3 turns.`,
			positive: true,
			length: 3
		},
		{
			name: 'Empowerment',
			id: '🏳️',
			description: `Deal 40% more damage for 3 turns.`,
			positive: true,
			length: 3
		},
		{
			name: 'Stun',
			id: '💫',
			description: `Next turn is skipped.`,
			positive: false,
			length: 1,
		},
		{
			name: 'Fortification',
			id: `🛡️`,
			description: `Increases armor by 20% for 3 turns.`,
			positive: true,
			length: 3
		},
		{
			name: 'Blindness',
			id: '👁️',
			description: `Decreases accuracy by 20% for 3 turns.`,
			positive: false,
			length: 3
		},
		{
			name: 'Focus',
			id: '🎯',
			description: `Increases accuracy by 50% for 3 turns.`,
			positive: true,
			length: 3
		},
		{
			name: 'Curse',
			id: '🖤',
			description: `Inflict 15% of initial damage for 8 turns.`,
			positive: false,
			length: 8,
			use: async function (EorP, statuses, currentHealth, chatLog, name, emaxHealth) {
				let status = statuses.find(({ id }) => id == this.id)
				var crit = 1
				if (Math.random() * 100 < 5) crit = 1.6
				currentHealth = Math.round(currentHealth - (status.damage * 0.15 * crit))
				chatLog.push(`${name} is cursed - ${crit == 2 ? 'CRITICAL ' : ''}🖤${Math.round(status.damage * 0.15 * crit)}`)
				status.length = status.length -= 1
				if (status.length == 0) statuses.splice(statuses.indexOf(status), 1)
				return {
					EorP: EorP,
					statuses: statuses,
					currentHealth: currentHealth,
					chatLog: chatLog,
					name: name
				};
			}
		},
		{
			name: 'Luck',
			id: '🍀',
			description: `Increases critical hit chance by 25% for 3 turns.`,
			positive: true,
			length: 3
		},
		{
			name: 'Bad Luck',
			id: '🐈‍⬛',
			description: `Decreases critical hit chance by 20% for 3 turns.`,
			positive: false,
			length: 3
		},
		{
			name: 'Berserk',
			id: '💢',
			description: `Increases attack by 40% but increases damage taken by 30%.`,
			positive: true,
			length: 3
		},
		{
			name: 'Evasion',
			id: '💨',
			description: `Decreases enemy attack accuracy by 15% for 3 turns.`,
			positive: true,
			length: 3
		},
		{
			name: 'Blessing',
			id: '✨',
			description: `Dispel and gain immunity to all negative status effects for 5 turns.`,
			positive: true,
			length: 5,
		},
		{
			name: 'Bad Omen',
			id: '🏴',
			description: `Dispel and gain immunity to all positive status effects for 5 turns.`,
			positive: false,
			length: 5,
		},

	],

	enemies: [
		{
			name: `Lazy Goblin`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1117502969370382366/New_Piskel_4_2.gif',
			weapon: "Rusted Dagger",
			maxHealth: 50 * Math.round(mult / 2),
			attack: 10,
			accuracy: 0.75,
			critical: 0.05,
			maxdef: 1,
			mindef: 0,
			skills: [
				{
					name: "Stab",
					chance: 0.85,
					attack: true
				},
				{
					name: "Lucky Blow",
					pstatus: ["🩸"],
					chance: 0.15,
					wait: 3,
					damage: 2,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.22
				},
				{
					name: "Copper Key",
					chance: 0.03
				},
				{
					name: "Silver Key",
					chance: 0.01
				},
				{
					name: "Twig",
					chance: 0.045
				},
				{
					name: "Branch",
					chance: 0.045
				},
				{
					name: "Broken Dagger",
					chance: 0.025
				},
				{
					name: "Tattered Rags",
					chance: 0.025
				},
				{
					name: "Cloth",
					chance: 0.25
				},
				{
					name: "Empty Flask",
					chance: 0.15
				},
				{
					name: "Water Flask",
					chance: 0.14
				},
				{
					name: "Booze",
					chance: 0.15
				},
			]
		},
		{
			name: `Blacksmith Goblin`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1121514870832124034/image_2.gif',
			weapon: "Blacksmith's Hammer",
			maxHealth: 75 * mult,
			attack: 30,
			accuracy: 0.8,
			critical: 0.05,
			maxdef: 2,
			mindef: 0,
			skills: [
				{
					name: "Slam",
					chance: 0.75,
					attack: true
				},
				{
					name: "Malet Strike",
					pstatus: ["💫"],
					chance: 0.15,
					wait: 2,
					damage: 0.5,
					attack: true
				},
				{
					name: "Metal Shavings",
					pstatus: ["🩸"],
					chance: 0.1,
					wait: 3,
					damage: 1.5,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.4
				},
				{
					name: "Copper Key",
					chance: 0.04
				},
				{
					name: "Silver Key",
					chance: 0.02
				},
				{
					name: "Broken Dagger",
					chance: 0.04
				},
				{
					name: "Rusty Dagger",
					chance: 0.02
				},
				{
					name: "Damaged Cloak",
					chance: 0.03
				},
				{
					name: "Whetstone",
					chance: 0.05
				},
				{
					name: "Gunpowder",
					chance: 0.1
				},
				{
					name: "Empty Flask",
					chance: 0.1
				},
				{
					name: "Water Flask",
					chance: 0.1
				},
				{
					name: "Booze",
					chance: 0.1
				},
			]
		},
		{
			name: `Armorer Goblin`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "Spear & Shield",
			maxHealth: 100 * mult,
			attack: 20,
			accuracy: 0.75,
			critical: 0.08,
			maxdef: 5,
			mindef: 2,
			skills: [
				{
					name: "Jab",
					chance: 0.75,
					attack: true
				},
				{
					name: "Rally",
					estatus: ["🛡️"],
					chance: 0.15,
					wait: 2,
					attack: false
				},
				{
					name: "Flurry",
					chance: 0.1,
					times: 3,
					damage: 1.5,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.85
				},
				{
					name: "Gold Key",
					chance: 0.02
				},
				{
					name: "Platinum Key",
					chance: 0.01
				},
				{
					name: "Great Sword",
					chance: 0.035
				},
				{
					name: "Skull Crusher",
					chance: 0.035
				},
				{
					name: "Iron Armor",
					chance: 0.05
				},
			]
		},
		{
			name: `Cursed Goblin`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1121510851543842907/image_1.gif',
			weapon: "Cursed Rusted Dagger",
			accuracy: 0.75,
			critical: 0.08,
			maxHealth: 75 * mult,
			maxdef: 4,
			mindef: 1,
			attack: 45,
			skills: [
				{
					name: "Stab",
					chance: 0.6,
					attack: true
				},
				{
					name: "Swipe",
					pstatus: ["🩸"],
					damage: 1.5,
					chance: 0.25,
					wait: 3,
					attack: true
				},
				{
					name: "Curse",
					pstatus: ["🖤"],
					chance: 0.15,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.6
				},
				{
					name: "Gold Key",
					chance: 0.045
				},
				{
					name: "Platinum Key",
					chance: 0.025
				},
				{
					name: "Adamantine Key",
					chance: 0.01
				},
				{
					name: "Red Gem",
					chance: 0.075
				},
				{
					name: "Blue Gem",
					chance: 0.075
				},
				{
					name: "Purple Gem",
					chance: 0.035
				},
				{
					name: "Whetstone",
					chance: 0.025
				},
				{
					name: "Cloth",
					chance: 0.09
				},
			]
		},
		{
			name: `Orc`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "Orc Club",
			accuracy: 0.8,
			critical: 0.1,
			maxHealth: 150 * mult,
			attack: 50,
			maxdef: 4,
			mindef: 2,
			skills: [
				{
					name: "Smash",
					chance: 0.65,
					attack: true
				},
				{
					name: "Grounding Stun",
					pstatus: ["💫"],
					chance: 0.15,
					damage: 1.1,
					wait: 2,
					attack: true
				},
				{
					name: "Crippling Strike",
					pstatus: ["🌀"],
					chance: 0.15,
					damage: 1.5,
					wait: 1,
					attack: true
				},
				{
					name: "Berserk",
					estatus: ["💢"],
					chance: 0.05,
					wait: 3,
					attack: false
				},
			],
			drops: [
				{
					name: null,
					chance: 0.55
				},
				{
					name: "Silver Key",
					chance: 0.01
				},
				{
					name: "Gold Key",
					chance: 0.04
				},
				{
					name: "Platinum Key",
					chance: 0.01
				},
				{
					name: "Cloth",
					chance: 0.015
				},
				{
					name: "Red Gem",
					chance: 0.045
				},
				{
					name: "Blue Gem",
					chance: 0.045
				},
				{
					name: "Purple Gem",
					chance: 0.01
				},
				{
					name: "Whetstone",
					chance: 0.05
				},
			]
		},
		{
			name: `Health Slime`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 1,
			critical: 0.1,
			maxHealth: 50 * Math.round(mult / 3),
			attack: 10,
			skills: [
				{
					name: "Jump",
					chance: 0.75,
					attack: true
				},
				{
					name: "Heal",
					health: 0.25,
					chance: 0.15,
					attack: false
				},
				{
					name: "Major Heal",
					health: 0.5,
					chance: 0.015,
					wait: 2,
					attack: false
				},
				{
					name: "Restoration",
					estatus: ["💗"],
					health: 0.1,
					chance: 0.15,
					wait: 1,
					attack: false
				},
			],
			drops: [
				{
					name: null,
					chance: 0.45
				},
				{
					name: "Green Goo",
					chance: 0.45
				},
				{
					name: "Sticky Solution",
					chance: 0.01
				},
				{
					name: "Light Health Potion",
					chance: 0.08
				},
				{
					name: "Medium Health Potion",
					chance: 0.01
				},
			]
		},
		{
			name: `Attack Slime`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1127663131330617445/image.gif',
			weapon: null,
			accuracy: 0.75,
			critical: 0.07,
			maxHealth: 50 * Math.round(mult / 4),
			attack: 40,
			skills: [
				{
					name: "Jump",
					chance: 0.68,
					attack: true
				},
				{
					name: "Lunge",
					pstatus: ["🩸"],
					wait: 3,
					chance: 0.08,
					attack: true
				},
				{
					name: "Burning Slide",
					pstatus: ["🔥"],
					chance: 0.08,
					damage: 1.5,
					wait: 5,
					attack: true
				},
				{
					name: "Slime Secretion",
					pstatus: ["💀"],
					estatus: ["💪"],
					chance: 0.08,
					wait: 3,
					attack: false
				},
			],
			drops: [
				{
					name: null,
					chance: 0.45
				},
				{
					name: "Red Goo",
					chance: 0.45
				},
				{
					name: "Sticky Solution",
					chance: 0.01
				},
				{
					name: "Light Attack Potion",
					chance: 0.08
				},
				{
					name: "Medium Attack Potion",
					chance: 0.01
				},
			]
		},
		{
			name: `Defense Slime`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1116446666917158932/New_Piskel_2_1.gif',
			weapon: null,
			maxHealth: 50 * mult,
			attack: 20,
			accuracy: 0.85,
			critical: 0.05,
			maxdef: 1,
			mindef: 6,
			skills: [
				{
					name: "Jump",
					chance: 0.7,
					attack: true
				},
				{
					name: "Rally",
					estatus: ["🛡️"],
					chance: 0.1,
					wait: 3,
					attack: false
				},
				{
					name: "Leap",
					pstatus: ["💫"],
					chance: 0.1,
					wait: 2,
					attack: true
				},
				{
					name: "Slime Secretion",
					pstatus: ["🌀"],
					chance: 0.1,
					wait: 3,
					attack: false
				},
			],
			drops: [
				{
					name: null,
					chance: 0.45
				},
				{
					name: "Blue Goo",
					chance: 0.45
				},
				{
					name: "Sticky Solution",
					chance: 0.01
				},
				{
					name: "Light Defense Potion",
					chance: 0.08
				},
				{
					name: "Medium Defense Potion",
					chance: 0.01
				},
			]
		},
		{
			name: `Stamina Slime`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.8,
			critical: 0.05,
			maxHealth: 50 * mult,
			attack: 25,
			maxdef: 3,
			mindef: 0,
			skills: [
				{
					name: "Jump",
					chance: 0.7,
					attack: true
				},
				{
					name: "Slippery Coat",
					pstatus: ["👁️"],
					chance: 0.1,
					attack: false,
					wait: 3
				},
				{
					name: "Slime Barrage",
					times: 3,
					chance: 0.1,
					attack: true,
				},
				{
					name: "Lucky Dance",
					estatus: ["🍀"],
					chance: 0.1,
					attack: false,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 0.45
				},
				{
					name: "Yellow Goo",
					chance: 0.45
				},
				{
					name: "Sticky Solution",
					chance: 0.01
				},
				{
					name: "Light Stamina Potion",
					chance: 0.08
				},
				{
					name: "Medium Stamina Potion",
					chance: 0.01
				},
			]
		},
		{
			name: `Orange Fox`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1117522664253300907/New_Piskel_4_2_1.gif',
			weapon: "Steel Dagger",
			accuracy: 0.85,
			critical: 0.1,
			maxHealth: 175 * mult,
			attack: 35,
			maxdef: 3,
			mindef: 1,
			skills: [
				{
					name: "Stab",
					chance: 0.7,
					attack: true
				},
				{
					name: "Smoke Bomb",
					pstatus: ["👁️"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Swift Movement",
					estatus: ["🎯", "💨"],
					chance: 0.1,
					wait: 3,
					attack: false
				},
				{
					name: "Double Strike",
					times: 2,
					chance: 0.15,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.2
				},
				{
					name: "Silver Key",
					chance: 0.04
				},
				{
					name: "Gold Key",
					chance: 0.02
				},
				{
					name: "Dual Hatchets",
					chance: 0.09
				},
				{
					name: "Leather Armor",
					chance: 0.05
				},
				{
					name: "Purified Salt",
					chance: 0.05
				},
				{
					name: "Gunpowder",
					chance: 0.1
				},
				{
					name: "Empty Flask",
					chance: 0.1
				},
				{
					name: "Water Flask",
					chance: 0.1
				},
				{
					name: "Booze",
					chance: 0.10
				},
				{
					name: "Pepper",
					chance: 0.1
				},
				{
					name: "Pepper Bomb",
					chance: 0.05
				},
			]
		},
		{
			name: `White Fox`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "Steel Dagger",
			accuracy: 0.8,
			critical: 0.1,
			maxHealth: 150 * mult,
			attack: 45,
			maxdef: 3,
			mindef: 2,
			skills: [
				{
					name: "Stab",
					chance: 0.7,
					attack: true
				},
				{
					name: "Smoke Bomb",
					pstatus: ["👁️"],
					estatus: ["💨"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Swift Movement",
					estatus: ["🎯", "💨"],
					wait: 3,
					chance: 0.1,
					attack: false
				},
				{
					name: "Quintuple Strike",
					times: 5,
					damage: 0.8,
					chance: 0.15,
					attack: true,
				},
			],
			drops: [
				{
					name: null,
					chance: 0.2
				},
				{
					name: "Silver Key",
					chance: 0.03
				},
				{
					name: "Gold Key",
					chance: 0.03
				},
				{
					name: "Dual Daggers",
					chance: 0.09
				},
				{
					name: "Leather Armor",
					chance: 0.05
				},
				{
					name: "Purified Salt",
					chance: 0.05
				},
				{
					name: "Gunpowder",
					chance: 0.1
				},
				{
					name: "Empty Flask",
					chance: 0.1
				},
				{
					name: "Water Flask",
					chance: 0.1
				},
				{
					name: "Booze",
					chance: 0.1
				},
				{
					name: "Pepper",
					chance: 0.1
				},
				{
					name: "Pepper Bomb",
					chance: 0.05
				},
			]
		},
		{
			name: `Blue Fox`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1121537810432794684/image_3.gif',
			weapon: "Steel Dagger",
			accuracy: 0.8,
			critical: 0.1,
			maxHealth: 175 * mult,
			attack: 55,
			maxdef: 3,
			mindef: 2,
			skills: [
				{
					name: "Stab",
					chance: 0.6,
					attack: true
				},
				{
					name: "Smoke Bomb",
					pstatus: ["👁️"],
					estatus: ["💨"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Swift Movement",
					estatus: ["🎯", "💨"],
					wait: 3,
					chance: 0.1,
					attack: false
				},
				{
					name: "Onslaught",
					times: 10,
					damage: 0.8,
					chance: 0.05,
					attack: true
				},
				{
					name: "Fatal Slash",
					pstatus: ["🩸", "💀"],
					chance: 0.1,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.2
				},
				{
					name: "Silver Key",
					chance: 0.02
				},
				{
					name: "Gold Key",
					chance: 0.04
				},
				{
					name: "Dual Daggers",
					chance: 0.045
				},
				{
					name: "Dual Hatchets",
					chance: 0.045
				},
				{
					name: "Leather Armor",
					chance: 0.05
				},
				{
					name: "Purified Salt",
					chance: 0.05
				},
				{
					name: "Gunpowder",
					chance: 0.1
				},
				{
					name: "Empty Flask",
					chance: 0.1
				},
				{
					name: "Water Flask",
					chance: 0.1
				},
				{
					name: "Booze",
					chance: 0.1
				},
				{
					name: "Pepper",
					chance: 0.1
				},
				{
					name: "Pepper Bomb",
					chance: 0.05
				},
			]
		},
		{
			name: `Vampire`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "Fangs",
			accuracy: 0.95,
			critical: 0.2,
			maxHealth: 90 * mult,
			attack: 40,
			maxdef: 6,
			mindef: 0,
			skills: [
				{
					name: "Lunge",
					chance: 0.7,
					pstatus: ["🩸"],
					attack: true
				},
				{
					name: "Drain",
					pstatus: ["🩸"],
					estatus: ["💗"],
					damage: 1.5,
					chance: 0.1,
					attack: true
				},
				{
					name: "Vampiric Gaze",
					pstatus: ["🌀", "🏴"],
					chance: 0.1,
					attack: true
				},
				{
					name: "Bat Transformation",
					pstatus: ["👁️"],
					estatus: ["🍀"],
					chance: 0.1,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.5
				},
				{
					name: "Platinum Key",
					chance: 0.03
				},
				{
					name: "Adamantine Key",
					chance: 0.01
				},
				{
					name: "Vampire Fangs",
					chance: 0.16
				},
				{
					name: "Red Gem",
					chance: 0.05
				},
				{
					name: "Blue Gem",
					chance: 0.05
				},
				{
					name: "Purple Gem",
					chance: 0.025
				},
				{
					name: "Venom",
					chance: 0.175
				},
			]
		},
		{
			name: `Demon`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1128734411375005777/New_Piskel_4.gif',
			weapon: null,
			accuracy: 0.85,
			critical: 0.15,
			maxHealth: 100 * mult,
			attack: 50,
			maxdef: 6,
			mindef: 2,
			skills: [
				{
					name: "Punch",
					chance: 0.55,
					attack: true
				},
				{
					name: "Flaming Fist",
					pstatus: ["🔥"],
					damage: 1.5,
					chance: 0.15,
					attack: true
				},
				{
					name: "Pummel",
					pstatus: ["💫", "🌀"],
					damage: 1.5,
					chance: 0.15,
					attack: true
				},
				{
					name: "Hex",
					pstatus: ["🔥", "👁️"],
					estatus: ["🏳️"],
					damage: 1.5,
					chance: 0.05,
					attack: true
				},
				{
					name: "Enrage",
					estatus: ["💢", "🍀", "💗"],
					pstatus: ["👁️"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Eternal Damnation",
					pstatus: ["🖤", "🌀", "🏴"],
					chance: 0.05,
					attack: true,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 0.5
				},
				{
					name: "Platinum Key",
					chance: 0.03
				},
				{
					name: "Adamantine Key",
					chance: 0.01
				},
				{
					name: "Demon Horn",
					chance: 0.16
				},
				{
					name: "Red Gem",
					chance: 0.06
				},
				{
					name: "Blue Gem",
					chance: 0.06
				},
				{
					name: "Purple Gem",
					chance: 0.035
				},
				{
					name: "Mana Infused Crystal",
					chance: 0.045
				},
			]
		},
		{
			name: `Werewolf`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.8,
			critical: 0.25,
			maxHealth: 115 * mult,
			attack: 40,
			maxdef: 4,
			mindef: 0,
			skills: [
				{
					name: "Bite",
					chance: 0.7,
					attack: true
				},
				{
					name: "Slash",
					pstatus: ["🩸"],
					damage: 1.5,
					chance: 0.15,
					attack: true
				},
				{
					name: "Crippling Bite",
					pstatus: ["🩸", "🌀"],
					damage: 2,
					chance: 0.05,
					attack: true
				},
				{
					name: "Howl",
					estatus: ["🏳️", "🍀", "💗"],
					chance: 0.1,
					attack: false,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 0.5
				},
				{
					name: "Platinum Key",
					chance: 0.03
				},
				{
					name: "Adamantine Key",
					chance: 0.01
				},
				{
					name: "Werewolf Claw",
					chance: 0.16
				},
				{
					name: "Red Gem",
					chance: 0.05
				},
				{
					name: "Blue Gem",
					chance: 0.05
				},
				{
					name: "Purple Gem",
					chance: 0.025
				},
				{
					name: "Cloth",
					chance: 0.175
				},
			]
		},
		{
			name: `Witch`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.9,
			critical: 0.05,
			maxHealth: 75 * mult,
			attack: 45,
			maxdef: 3,
			mindef: 0,
			skills: [
				{
					name: "Whack",
					chance: 0.4,
					attack: true
				},
				{
					name: "Poisionous Potion",
					pstatus: ["💀"],
					damage: 2,
					chance: 0.15,
					attack: true
				},
				{
					name: "Sleeping Potion",
					pstatus: ["💫", "🌀"],
					chance: 0.15,
					attack: true,
					wait: 1
				},
				{
					name: "Voodoo Stab",
					pstatus: ["🩸"],
					chance: 0.15,
					attack: true,
					wait: 1
				},
				{
					name: "Hex",
					pstatus: ["💀", "👁️", "🖤"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Potion Barrage",
					pstatus: ["🖤", "💫", "👁️", "💀", "🌀", "🏴"],
					chance: 0.05,
					attack: false,
					wait: 5
				},
			],
			drops: [
				{
					name: null,
					chance: 0.5
				},
				{
					name: "Platinum Key",
					chance: 0.03
				},
				{
					name: "Adamantine Key",
					chance: 0.01
				},
				{
					name: "Mana Infused Crystal",
					chance: 0.2
				},
				{
					name: "Red Gem",
					chance: 0.05
				},
				{
					name: "Blue Gem",
					chance: 0.05
				},
				{
					name: "Purple Gem",
					chance: 0.025
				},
				{
					name: "Venom",
					chance: 0.175
				},
			]
		},
		{
			name: `Cow`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.5,
			critical: 0.1,
			maxHealth: 10 * mult,
			attack: 15,
			maxdef: 1,
			mindef: 0,
			skills: [
				{
					name: "Moo",
					chance: 0.9,
					attack: false
				},
				{
					name: "Kick",
					chance: 0.1,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.3
				},
				{
					name: "Milk",
					chance: 0.7
				}
			]
		},
		{
			name: `Sheep`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1127670108970561648/New_Piskel_3.gif',
			weapon: null,
			accuracy: 0.5,
			critical: 0.1,
			maxHealth: 20 * mult,
			attack: 0,
			maxdef: 2,
			mindef: 0,
			skills: [
				{
					name: "Baa",
					chance: 0.9,
					attack: false
				},
				{
					name: "Kick",
					chance: 0.1,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.3
				},
				{
					name: "Wool",
					chance: 0.7
				}
			]
		},
		{
			name: `Chicken`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.5,
			critical: 0.1,
			maxHealth: 5 * mult,
			attack: 10,
			skills: [
				{
					name: "Cluck",
					chance: 0.9,
					attack: false
				},
				{
					name: "Kick",
					chance: 0.1,
					attack: true
				},
			],
			drops: [
				{
					name: null,
					chance: 0.3
				},
				{
					name: "Egg",
					chance: 0.7
				}
			]
		},
		{
			name: `Cyclops Overlord`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1127658659657298050/New_Piskel_2_1.gif',
			weapon: null,
			accuracy: 0.78,
			critical: 0.15,
			maxHealth: 250 * Math.round(mult / 1.5),
			attack: 80,
			maxdef: 7,
			mindef: 5,
			skills: [
				{
					name: "Swing",
					chance: 0.55,
					attack: true
				},
				{
					name: "Slam",
					damage: 1.5,
					pstatus: ["💫"],
					chance: 0.05,
					attack: true
				},
				{
					name: "Rally",
					estatus: ["🛡️", "🎯"],
					pstatus: ["👁️"],
					chance: 0.15,
					attack: false,
					wait: 3
				},
				{
					name: "Roar",
					estatus: ["💢"],
					pstatus: ["💫"],
					chance: 0.1,
					attack: false
				},
				{
					name: "Flex",
					estatus: ["🏳️", "🍀"],
					chance: 0.15,
					attack: false,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 1
				}
			]
		},
		{
			name: `Fox King`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 1,
			critical: 0.15,
			maxHealth: 225 * mult,
			attack: 150,
			maxdef: 7,
			mindef: 4,
			skills: [
				{
					name: "Stab",
					chance: 0.7,
					attack: true
				},
				{
					name: "Smoke Bomb",
					pstatus: ["👁️"],
					estatus: ["💨"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Swift Movement",
					estatus: ["🎯", "💨"],
					chance: 0.1,
					attack: false,
					wait: 3
				},
				{
					name: "Onslaught",
					damage: 0.8,
					times: 10,
					chance: 0.05,
					attack: true
				},
				{
					name: "Fatal Slash",
					pstatus: ["🩸", "💀"],
					chance: 0.1,
					attack: true,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 1
				}
			]
		},
		{
			name: `Goblin King`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.9,
			critical: 0.15,
			maxHealth: 300 * mult,
			attack: 175,
			maxdef: 7,
			mindef: 5,
			skills: [
				{
					name: "Smash",
					chance: 0.45,
					attack: true
				},
				{
					name: "Grounding Stun",
					pstatus: ["💫"],
					damage: 1.1,
					chance: 0.15,
					attack: true,
					wait: 2
				},
				{
					name: "Crippling Strike",
					pstatus: ["🌀"],
					damage: 1.5,
					chance: 0.15,
					attack: true
				},
				{
					name: "Transform",
					estatus: ["💢"],
					pstatus: ["💫"],
					times: 10,
					chance: 0.05,
					attack: false
				},
				{
					name: "Heal",
					health: 0.25,
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Restoration",
					estatus: ["💗"],
					health: 0.15,
					chance: 0.15,
					attack: false,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 1
				}
			]
		},
		{
			name: `Demon Queen`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.99,
			critical: 0.15,
			maxHealth: 550 * mult,
			attack: 125,
			maxdef: 10,
			mindef: 0,
			skills: [
				{
					name: "Slap",
					chance: 0.55,
					attack: true
				},
				{
					name: "Cursed Hell Flames",
					pstatus: ["🔥", "🩸", "🖤"],
					damage: 1.5,
					chance: 0.15,
					attack: true,
					wait: 3
				},
				{
					name: "Pummel",
					pstatus: ["💫", "🌀"],
					damage: 1.5,
					chance: 0.15,
					attack: true,
					wait: 3
				},
				{
					name: "Queen's Gaze",
					pstatus: ["🖤", "👁️", "🌀", "🏴"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Demonic Embrace",
					pstatus: ["👁️"],
					estatus: ["💢", "🏳️", "🍀", "💗", "✨", "🛡️"],
					chance: 0.05,
					attack: false,
					wait: 3
				},
				{
					name: "Eternal Onslaught",
					pstatus: ["🖤", "🩸"],
					times: 12,
					damage: 0.2,
					chance: 0.025,
					attack: true,
					wait: 3
				},
				{
					name: "Queenly Disrespect",
					estatus: ["🏳️"],
					pstatus: ["🌀", "💫", "🏴"],
					damage: 0.9,
					chance: 0.1,
					attack: true,
					wait: 3
				},
				{
					name: "Royal Dropkick",
					pstatus: ["🌀", "💫"],
					damage: 2,
					chance: 0.025,
					attack: true,
					wait: 3
				},
			],
			drops: [
				{
					name: null,
					chance: 1
				}
			]
		},
	],

	areas: [
		{
			name: "Warhamshire",
			minlvl: 1,
			maxlvl: 5,
			enemies: [
				{
					name: "Cow",
					chance: 0.05
				},
				{
					name: "Chicken",
					chance: 0.05
				},
				{
					name: "Lazy Goblin",
					chance: 0.25
				},
				{
					name: "Health Slime",
					chance: 0.25
				},
				{
					name: "Attack Slime",
					chance: 0.25
				}
			],
			chests: [
				{
					chest: 1,
					chance: 0.05,
					keyChance: 0.02,
					key: true
				},
				{
					chest: 2,
					chance: 0.03,
					keyChance: 0.01,
					key: true
				},
			]
		},
		{
			name: "Warham Castle",
			minlvl: 5,
			maxlvl: 10,
			enemies: [
				{
					name: "Cyclops Overlord",
					chance: 0.02
				},
				{
					name: "Cow",
					chance: 0.06
				},
				{
					name: "Sheep",
					chance: 0.06
				},
				{
					name: "Chicken",
					chance: 0.06
				},
				{
					name: "Blacksmith Goblin",
					chance: 0.14
				},
				{
					name: "Lazy Goblin",
					chance: 0.14
				},
				{
					name: "Health Slime",
					chance: 0.14
				},
				{
					name: "Attack Slime",
					chance: 0.14
				},
				{
					name: "Defense Slime",
					chance: 0.14
				},
			],
			chests: [
				{
					chest: 1,
					chance: 0.05,
					keyChance: 0.02,
					key: true
				},
				{
					chest: 2,
					chance: 0.03,
					keyChance: 0.01,
					key: true
				},
			]
		},
		{
			name: "Hinterland",
			minlvl: 8,
			maxlvl: 14,
			enemies: [
				{
					name: "Orange Fox",
					chance: 0.01
				},
				{
					name: "Orc",
					chance: 0.04
				},
				{
					name: "Cow",
					chance: 0.05
				},
				{
					name: "Sheep",
					chance: 0.05
				},
				{
					name: "Chicken",
					chance: 0.05
				},
				{
					name: "Health Slime",
					chance: 0.14
				},
				{
					name: "Attack Slime",
					chance: 0.14
				},
				{
					name: "Defense Slime",
					chance: 0.14
				},
				{
					name: "Blacksmith Goblin",
					chance: 0.14
				},
				{
					name: "Lazy Goblin",
					chance: 0.14
				},
			],
			chests: [
				{
					chest: 2,
					chance: 0.06,
					keyChance: 0.01,
					key: true
				},
				{
					chest: 3,
					chance: 0.02,
					keyChance: 0.01,
					key: true
				},
			]
		},
		{
			name: "Uralan Mountains",
			minlvl: 12,
			maxlvl: 18,
			enemies: [
				{
					name: "Orc",
					chance: 0.05
				},
				{
					name: "Cow",
					chance: 0.05
				},
				{
					name: "Sheep",
					chance: 0.05
				},
				{
					name: "Chicken",
					chance: 0.05
				},
				{
					name: "White Fox",
					chance: 0.14
				},
				{
					name: "Blue Fox",
					chance: 0.14
				},
				{
					name: "Attack Slime",
					chance: 0.14
				},
				{
					name: "Stamina Slime",
					chance: 0.14
				},
				{
					name: "Health Slime",
					chance: 0.14
				},
			],
			chests: [
				{
					chest: 2,
					chance: 0.045,
					keyChance: 0.01,
					key: true
				},
				{
					chest: 3,
					chance: 0.035,
					keyChance: 0.01,
					key: true
				},
			]
		},
		{
			name: "Vulpeston",
			minlvl: 16,
			maxlvl: 22,
			enemies: [
				{
					name: "Cow",
					chance: 0.05
				},
				{
					name: "Sheep",
					chance: 0.05
				},
				{
					name: "Chicken",
					chance: 0.05
				},
				{
					name: "Health Slime",
					chance: 0.15
				},
				{
					name: "Orange Fox",
					chance: 0.16
				},
				{
					name: "White Fox",
					chance: 0.16
				},
				{
					name: "Blue Fox",
					chance: 0.16
				},
				{
					name: "Attack Slime",
					chance: 0.16
				},
				{
					name: "Stamina Slime",
					chance: 0.16
				},
			],
			chests: [
				{
					chest: 2,
					chance: 0.03,
					keyChance: 0.01,
					key: true
				},
				{
					chest: 3,
					chance: 0.035,
					keyChance: 0.01,
					key: true
				},
			]
		},
		{
			name: "Vulpes Tower",
			minlvl: 21,
			maxlvl: 29,
			enemies: [
				{
					name: "Fox King",
					chance: 0.03
				},
				{
					name: "Cow",
					chance: 0.05
				},
				{
					name: "Sheep",
					chance: 0.05
				},
				{
					name: "Chicken",
					chance: 0.05
				},
				{
					name: "Orange Fox",
					chance: 0.12
				},
				{
					name: "White Fox",
					chance: 0.12
				},
				{
					name: "Blue Fox",
					chance: 0.12
				},
				{
					name: "Attack Slime",
					chance: 0.12
				},
				{
					name: "Stamina Slime",
					chance: 0.12
				},
				{
					name: "Health Slime",
					chance: 0.12
				},
			],
			chests: [
				{
					chest: 2,
					chance: 0.03,
					keyChance: 0.01,
					key: true
				},
				{
					chest: 3,
					chance: 0.05,
					keyChance: 0.01,
					key: true
				},
			]
		},
		{
			name: "Vexadel",
			minlvl: 30,
			maxlvl: 35,
			enemies: [
				{
					name: "Cow",
					chance: 0.06
				},
				{
					name: "Sheep",
					chance: 0.06
				},
				{
					name: "Chicken",
					chance: 0.06
				},
				{
					name: "Lazy Goblin",
					chance: 0.09
				},
				{
					name: "Blacksmith Goblin",
					chance: 0.09
				},
				{
					name: "Armorer Goblin",
					chance: 0.09
				},
				{
					name: "Cursed Goblin",
					chance: 0.09
				},
				{
					name: "Health Slime",
					chance: 0.09
				},
				{
					name: "Attack Slime",
					chance: 0.09
				},
				{
					name: "Stamina Slime",
					chance: 0.09
				},
				{
					name: "Defense Slime",
					chance: 0.09
				},
			],
			chests: [
				{
					chest: 3,
					chance: 0.025,
					keyChance: 0.025,
					key: true
				},
				{
					chest: 4,
					chance: 0.025,
					keyChance: 0.025,
					key: true
				},
			]
		},
		{
			name: "Vexadel Gaillard",
			minlvl: 35,
			maxlvl: 40,
			enemies: [
				{
					name: "Goblin King",
					chance: 0.02
				},
				{
					name: "Orc",
					chance: 0.04
				},
				{
					name: "Armorer Goblin",
					chance: 0.12
				},
				{
					name: "Cursed Goblin",
					chance: 0.12
				},
				{
					name: "Blacksmith Globlin",
					chance: 0.12
				},
				{
					name: "Attack Slime",
					chance: 0.12
				},
				{
					name: "Stamina Slime",
					chance: 0.12
				},
				{
					name: "Defense Slime",
					chance: 0.12
				},
				{
					name: "Health Slime",
					chance: 0.12
				},
			],
			chests: [
				{
					chest: 3,
					chance: 0.03,
					keyChance: 0.03,
					key: true
				},
				{
					chest: 4,
					chance: 0.02,
					keyChance: 0.02,
					key: true
				},
			]
		},
		{
			name: "Sanguisuge",
			minlvl: 40,
			maxlvl: 45,
			enemies: [
				{
					name: "Cursed Goblin",
					chance: 0.1
				},
				{
					name: "Attack Slime",
					chance: 0.1
				},
				{
					name: "Stamina Slime",
					chance: 0.1
				},
				{
					name: "Health Slime",
					chance: 0.1
				},
				{
					name: "Defense Slime",
					chance: 0.1
				},
				{
					name: "Vampire",
					chance: 0.1
				},
				{
					name: "Demon",
					chance: 0.1
				},
				{
					name: "Werewolf",
					chance: 0.1
				},
				{
					name: "Witch",
					chance: 0.1
				},
			],
			chests: [
				{
					chest: 4,
					chance: 0.05,
					keyChance: 0.03,
					key: true
				},
				{
					chest: 5,
					chance: 0.01,
					keyChance: 0.02,
					key: true
				},
			]
		},
		{
			name: "Sangston Mansion",
			minlvl: 45,
			maxlvl: 50,
			enemies: [
				{
					name: "Demon Queen",
					chance: 0.1
				},
				{
					name: "Cursed Goblin",
					chance: 0.2
				},
				{
					name: "Witch",
					chance: 0.2
				},
				{
					name: "Vampire",
					chance: 0.2
				},
				{
					name: "Demon",
					chance: 0.2
				},
				{
					name: "Werewolf",
					chance: 0.2
				},
			],
			chests: [
				{
					chest: 4,
					chance: 0.03,
					keyChance: 0.02,
					key: true
				},
				{
					chest: 5,
					chance: 0.03,
					keyChance: 0.01,
					key: true
				},
			]
		},
	],

	items: [
		// WEAPONS
		{
			name: "Fists",
			maxlvl: 1,
			minlvl: 1,
			description: `The enemies can catch these hands.`,
			attack: 0,
			plvlmult: 0,
			crit: 0,
			drop: 0,
			skills: [
				{
					name: "Punch",
					attack: true
				},
				{
					name: "Kick",
					cost: 3,
					description: "A complementary can of kick-ass.",
					damage: 1.2,
					attack: true
				},
				{
					name: "Relieve",
					cost: 5,
					description: "Stop and crack your knuckles.",
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Twig",
			maxlvl: 5,
			minlvl: 1,
			description: `A stick.`,
			attack: 5,
			plvlmult: 0.2,
			crit: 0.005,
			drop: 0.025,
			skills: [
				{
					name: "Whack",
					attack: true
				},
				{
					name: "Poke Eye",
					description: `Poke 'em in the eye.`,
					cost: 5,
					damage: 0.9,
					estatus: ["👁️"],
					attack: true
				},
				{
					name: "Thwack",
					description: `Thwack them with your stick!`,
					cost: 8,
					damage: 1.2,
					attack: true
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds.`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Branch",
			maxlvl: 8,
			minlvl: 1,
			description: `A heftier stick.`,
			attack: 8,
			plvlmult: 0.5,
			crit: 0.01,
			drop: 0.025,
			skills: [
				{
					name: "Whack",
					attack: true
				},
				{
					name: "Hefty Swing",
					description: `Batter up!`,
					cost: 10,
					damage: 1.4,
					attack: true
				},
				{
					name: "Barbaric Shout",
					description: `Scream at the top of your lungs.`,
					pstatus: ["💪"],
					cost: 6,
					attack: false
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds.`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Broken Dagger",
			maxlvl: 10,
			minlvl: 2,
			description: `A mysteriously sharpened broken dagger.`,
			attack: 9,
			plvlmult: 0.5,
			crit: 0.025,
			drop: 0.2,
			skills: [
				{
					name: "Stab",
					attack: true
				},
				{
					name: "Hope For The Best",
					description: `Hope for the best.`,
					cost: 9,
					pstatus: ["🍀"],
					attack: false
				},
				{
					name: "Wild Stab",
					description: `Stabby stabby stab.`,
					estatus: ["🩸"],
					damage: 1.3,
					cost: 12,
					attack: true
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds.`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Rusty Dagger",
			maxlvl: 10,
			minlvl: 4,
			description: `A dagger that's lost its edge due to rust, but is still useable.`,
			attack: 12,
			plvlmult: 0.7,
			crit: 0.0125,
			drop: 0.1,
			skills: [
				{
					name: "Stab",
					attack: true
				},
				{
					name: "Slash",
					description: `Slice with ferocity.`,
					cost: 12,
					damage: 1.5,
					attack: true
				},
				{
					name: "Kick",
					description: `Give 'em a roundhouse kick in the face!`,
					estatus: ["💫", "🌀"],
					damage: 0.85,
					cost: 15,
					attack: true
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds.`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Trusty Dagger",
			maxlvl: 12,
			minlvl: 6,
			description: `A clean dagger that feels reliable with a nicely sharpened edge.`,
			attack: 14,
			plvlmult: 0.7,
			crit: 0.03,
			drop: 0.05,
			chest: 1,
			skills: [
				{
					name: "Stab",
					attack: true
				},
				{
					name: "Repeated Slash",
					description: `Slash with ferocity.`,
					cost: 13,
					damage: 0.75,
					estatus: ["🩸"],
					times: 3,
					attack: true
				},
				{
					name: "Swift Attack",
					description: `Stab faster than they can see!`,
					cost: 9,
					pstatus: ["💨"],
					damage: 1.1,
					attack: true
				},
				{
					name: "Quick Fix",
					description: `Wrap your wound in cloth.`,
					cost: 15,
					health: 0.1,
					attack: false
				},
			]
		},
		{
			name: "The Perfect Stick",
			maxlvl: 12,
			minlvl: 6,
			description: `A truly magnificent stick. It naturally has the right amount of weight and rigidity.`,
			attack: 15,
			plvlmult: 0.7,
			crit: 0.05,
			drop: 0.025,
			chest: 1,
			skills: [
				{
					name: "Perfect Whack",
					attack: true
				},
				{
					name: "Perfect Swing",
					description: `Swing at the the enemy with perfect trajectory.`,
					cost: 20,
					damage: 1.25,
					pstatus: ["💪"],
					attack: true
				},
				{
					name: "All or Nothing",
					description: `Put all your eggs in one basket.`,
					cost: 25,
					pstatus: ["💫"],
					damage: 3.25,
					attack: true
				},
				{
					name: "Quick Fix",
					description: `Wrap your wound in cloth.`,
					cost: 15,
					health: 0.1,
					attack: false
				},
			]
		},
		{
			name: "Iron Short Sword",
			maxlvl: 14,
			minlvl: 6,
			description: `A polished short sword that was clearly in good care.`,
			attack: 12,
			plvlmult: 1,
			crit: 0.065,
			drop: 0.025,
			chest: 2,
			skills: [
				{
					name: "Strike",
					attack: true
				},
				{
					name: "Double Strike",
					description: `Two-Sword Style.`,
					cost: 15,
					times: 2,
					damage: 0.9,
					attack: true
				},
				{
					name: "Warrior's Resolve",
					description: `Howl like the warrior you are!`,
					cost: 20,
					pstatus: ["💗", "💪"],
					attack: false
				},
				{
					name: "Kick",
					description: `Foot!`,
					estatus: ["💫", "🌀"],
					cost: 15,
					damage: 0.85,
					attack: true
				},
			]
		},
		{
			name: "Golden Stick",
			maxlvl: 45,
			minlvl: 25,
			description: `The absolute perfect stick with no imperfections. Made from a wood that is as shiny as gold.`,
			attack: 25,
			plvlmult: 1.5,
			crit: 0.2,
			drop: 0.01,
			chest: 3,
			skills: [
				{
					name: "Golden Whack",
					attack: true
				},
				{
					name: "Golden Rush",
					description: `Bother the enemy to the finest several times.`,
					cost: 25,
					times: 7,
					damage: 0.77,
					attack: true
				},
				{
					name: "Brandish",
					description: `Show off your weapon and use it to reflect light into the enemy's eye.`,
					cost: 30,
					pstatus: ["💢", "🍀"],
					estatus: ["👁️", "🌀"],
					attack: false
				},
				{
					name: "Golden Standard",
					description: `You are perfect, so act like it.`,
					pstatus: ["🏳️", "✨", "💨"],
					cost: 20,
					haelth: 0.25,
					attack: false
				},
			]
		},
		{
			name: "Dual Daggers",
			maxlvl: 24,
			minlvl: 13,
			description: `A pair of iron daggers that looks as if they are to be used in tadem.`,
			attack: 16,
			plvlmult: 1.2,
			crit: 0.1,
			drop: 0.15,
			skills: [
				{
					name: "Dual Strike",
					damage: 0.5,
					times: 2,
					attack: true,
				},
				{
					name: "Swift Barrage",
					description: `Unleash a quick barrage of slashes.`,
					cost: 16,
					times: 7,
					damage: 0.25,
					attack: true
				},
				{
					name: "Rogue’s Gambit",
					description: `You're a winner!`,
					cost: 14,
					pstatus: ["🍀"],
					attack: false
				},
				{
					name: "Quick Fix",
					description: `Wrap your wound in cloth.`,
					cost: 15,
					health: 0.1,
					attack: false
				},
			]
		},
		{
			name: "Dual Hatchets",
			maxlvl: 24,
			minlvl: 13,
			description: `A pair of lumberjack hatches good for damage!`,
			attack: 20,
			plvlmult: 1.2,
			crit: 0.15,
			drop: 0.15,
			skills: [
				{
					name: "Dual Strike",
					damage: 0.5,
					times: 2,
					attack: true,
				},
				{
					name: "Ferocious Combo",
					description: "Strike the axes together and rush the enemy.",
					cost: 16,
					damage: 0.8,
					times: 3,
					attack: true
				},
				{
					name: "Berserker's Cry",
					description: "Let out an intimidating shout.",
					cost: 15,
					pstatus: ["💢", "🎯", "💪"],
					estatus: ["🌀"],
					attack: false
				},
				{
					name: "Walk it Off",
					description: "Grit your teeth and power through the pain.",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Iron Sword",
			maxlvl: 27,
			minlvl: 15,
			description: `A heavy-weight classic weapon of attack and defense.`,
			attack: 20,
			plvlmult: 1.1,
			crit: 0.095,
			drop: 0.025,
			chest: 3,
			skills: [
				{
					name: "Strike",
					attack: true
				},
				{
					name: "Triple Strike",
					description: "Poke poke poke.",
					cost: 18,
					damage: 0.8,
					times: 3,
					attack: true
				},
				{
					name: "Knight's Resolve",
					description: "Read yourself for combat.",
					cost: 15,
					pstatus: ["💪", "💗", "🛡️"],
					attack: false
				},
				{
					name: "Kick",
					description: "Give 'em a roundhouse kick to the face.",
					cost: 15,
					estatus: ["💫", "🌀"],
					damage: 0.85,
					attack: true
				}
			]
		},
		{
			name: "Wooden Bow",
			maxlvl: 32,
			minlvl: 19,
			description: `A lightweight ranged weapon to get your enemies from afar.`,
			attack: 15,
			plvlmult: 1,
			crit: 0.15,
			drop: 0.05,
			chest: 3,
			skills: [
				{
					name: "Quick Shot",
					attack: true
				},
				{
					name: "Jackpot",
					description: "Unleash a powerful shot concentrated on an enemy's weakpoint.",
					cost: 25,
					damage: 2,
					pstatus: ["🎯", "🍀"],
					estatus: ["🌀", "💫", "🩸"],
					attack: true
				},
				{
					name: "Rapid Barrage",
					description: "Swiftly fire multiple arrows.",
					cost: 40,
					damage: 0.2,
					times: 9,
					attack: true
				},
				{
					name: "Combat Heal",
					description: "Utilize medic knowledge to heal your wounds.",
					cost: 25,
					health: 0.15,
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Lumberjack Axe",
			maxlvl: 32,
			minlvl: 19,
			description: `A lumberjack's best friend.`,
			attack: 26,
			plvlmult: 0.8,
			crit: 0.3,
			drop: 0.05,
			chest: 3,
			skills: [
				{
					name: "Chop",
					attack: true
				},
				{
					name: "Mighty Axe Swing",
					description: "Swing your axe with full force.",
					cost: 40,
					damage: 3.25,
					attack: true,
				},
				{
					name: "Rallying Shout",
					description: "Let out a mighty yell.",
					cost: 15,
					pstatus: ["💪", "🛡️"],
					attack: false
				},
				{
					name: "Hearty Breakfast",
					description: "Pull out your lunchbox and chomp down on a bacon omelet and grits.",
					cost: 30,
					pstatus: ["🏳️", "💗"],
					attack: false
				}
			]
		},
		{
			name: "Silver Dagger",
			maxlvl: 32,
			minlvl: 19,
			description: `A knife colored silver. Great for murder!`,
			attack: 15,
			plvlmult: 1.25,
			crit: 0.15,
			drop: 0.05,
			chest: 3,
			skills: [
				{
					name: "Stab",
					attack: true
				},
				{
					name: "Swift Assault",
					description: "Quickly attack the enemy.",
					cost: 15,
					times: 3,
					damage: 0.8,
					estatus: ["💀"],
					attack: true
				},
				{
					name: "Poison Cloud",
					description: "Throw a poison smoke bomb.",
					cost: 25,
					damage: 0.8,
					estatus: ["🌀", "👁️", "💀"],
					attack: true
				},
				{
					name: "Combat Heal",
					description: "Utilize medic knowledge to heal your wounds.",
					cost: 25,
					health: 0.15,
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Martial Arts",
			maxlvl: 40,
			minlvl: 25,
			description: `A close-quarter combat "weapon" mainly used for defensive strategies.`,
			attack: 10,
			plvlmult: 1.75,
			crit: 0.2,
			drop: 0.05,
			chest: 3,
			skills: [
				{
					name: ["Back Fist", "Elbow Strike", "Hammer Fist", "Haymaker Punch", "Hook Punch", "Jab Punch", "Knife Hand Strike", "Palm Strike", "Slap", "Straight Punch", "Uppercut Punch"][Math.floor(Math.random() * 11)],
					attack: true
				},
				{
					name: "Fighter's Mix",
					description: "A barrage of punches.",
					cost: 20,
					damage: 0.4,
					pstatus: ["🎯", "💪", "🍀"],
					attack: true
				},
				{
					name: "Gut Punch",
					description: "Powerful swing to the stomach of the enemy.",
					cost: 20,
					damage: 1.2,
					estatus: ["🌀", "💫"],
					pstatus: ["💢"],
					attack: true
				},
				{
					name: "Walk it Off",
					description: "Grit your teeth and power through the pain.",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Chainsaw",
			maxlvl: 50,
			minlvl: 26,
			description: `A heavy-duty cutting tool with teeth set on a chain which moves around the edge of a blade.`,
			attack: 10,
			plvlmult: 1,
			crit: 0.1,
			drop: 0.05,
			chest: 4,
			skills: [
				{
					name: "Saw",
					attack: true
				},
				{
					name: "Rampage",
					description: "Charge the enemy while swinging your chainsaw.",
					estatus: ["🩸"],
					cost: 40,
					times: 10,
					damage: 0.8,
					attack: true
				},
				{
					name: "Opening Carnage",
					description: "Headbutt the enemy before swinging your chainsaw.",
					cost: 35,
					estatus: ["🌀"],
					pstatus: ["🏳️", "💢"],
					times: 6,
					damage: 0.2,
					attack: true
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination.",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Great Sword",
			maxlvl: 36,
			minlvl: 28,
			description: `A standard super-sized weapon used for disabling great foes!`,
			attack: 18,
			plvlmult: 1.2,
			crit: 0.15,
			drop: 0.15,
			skills: [
				{
					name: "Swing",
					attack: true
				},
				{
					name: "Heavy Slash",
					description: "Send forth a powerful swing with your oversized blade.",
					cost: 25,
					damage: 2,
					estatus: ["🩸"],
					attack: true
				},
				{
					name: "Royal Knight's Resolve",
					description: "Take a stance and gather your focus to heighten your abilities.",
					cost: 30,
					pstatus: ["🏳️", "💗", "🛡️"],
					attack: false
				},
				{
					name: "Shoulder Bash",
					description: "Ram the enemy with a shoulder.",
					cost: 20,
					estatus: ["🌀"],
					damage: 0.45,
					health: 0.1,
					attack: true
				}
			]
		},
		{
			name: "Skull Crusher",
			maxlvl: 36,
			minlvl: 28,
			description: `Sometimes big problems require a just as big simple solution like a giant hammer.`,
			attack: 30,
			plvlmult: 1,
			crit: 0.08,
			drop: 0.15,
			skills: [
				{
					name: "Bash",
					attack: true
				},
				{
					name: "Immense Impact",
					description: "Slam your hammer down on a foe with all your might.",
					estatus: ["🌀", "💫"],
					cost: 40,
					damage: 4,
					attack: true
				},
				{
					name: "Sinister Grin",
					description: "Lower weapon and give the enemy a 2 free swings while smiling.",
					cost: 25,
					pstatus: ["💫", "💢", "🏳️", "💪"],
					attack: false
				},
				{
					name: "Walk it Off",
					description: "Grit your teeth and power through the pain.",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Twin Swords",
			maxlvl: 40,
			minlvl: 30,
			description: `Short-ranged dual weaponry for classic double strikes.`,
			attack: 10,
			plvlmult: 1.75,
			crit: 0.2,
			drop: 0.05,
			chest: 4,
			skills: [
				{
					name: "Dual Strike",
					damage: 0.5,
					times: 2,
					attack: true,
				},
				{
					name: "Stylish Barrage",
					description: "Unleash a swift barrage of attacks that feel very cool to do.",
					pstatus: ["🏳️"],
					cost: 25,
					times: 6,
					damage: 0.4,
					attack: true
				},
				{
					name: "Brandish",
					description: "Show off your weapon and reflect sunlight into the enemy's eye.",
					cost: 30,
					pstatus: ["💢", "🍀"],
					estatus: ["👁️"]
				},
				{
					name: "Combat Heal",
					description: "Utilize medic knowledge to heal your wounds.",
					cost: 25,
					health: 0.15,
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Spiked Gauntlents",
			maxlvl: 40,
			minlvl: 30,
			description: `A pair of gloves laced with knuckle spikes for a deadly victory.`,
			attack: 15,
			plvlmult: 1.6,
			crit: 0.25,
			drop: 0.05,
			chest: 4,
			skills: [
				{
					name: "Knuckle Sandwich",
					damage: 0.5,
					times: 2,
					attack: true,
				},
				{
					name: "3-Piece Combo",
					cost: 20,
					description: "Use your hands to give the enemy a 3 piece combo with sauce.",
					pstatus: ["🎯", "💪"],
					estatus: ["🩸"],
					times: 3,
					damage: 0.7,
					attack: true
				},
				{
					name: "Serve Dessert",
					cost: 25,
					description: "A powerful knee aimaed at the enemy's face.",
					pstatus: ["💢"],
					estatus: ["🌀"],
					damage: 1.1,
					attack: true
				},
				{
					name: "Snack Break",
					description: "Pull out a protein bar and enjoy.",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Ninja Arts",
			maxlvl: 50,
			minlvl: 32,
			description: `A survivability combat martial art "weapon" mainly used for concealment and offensive survival strategies.`,
			attack: 20,
			plvlmult: 1.75,
			crit: 0.3,
			drop: 0.05,
			chest: 4,
			skills: [
				{
					name: "Kunai",
					attack: true,
				},
				{
					name: "Clean Cut",
					cost: 15,
					description: "A swift and precise slash through the enemy.",
					damage: 2,
					estatus: ["🩸"],
					attack: true
				},
				{
					name: "Kunai Barrage",
					cost: 25,
					description: "Rapidly throw a variety of kunai at the foe.",
					damage: 0.2,
					times: 7,
					pstatus: ["🎯", "🍀"],
					estatus: ["🌀", "👁️"],
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Holy Spear",
			maxlvl: 50,
			minlvl: 32,
			description: `A famous weapon given to the leaders of crusades and it’s imbued with the ability to strengthen its wielder utilizing their willpower.`,
			attack: 20,
			plvlmult: 2,
			crit: 0.15,
			drop: 0.01,
			chest: 4,
			skills: [
				{
					name: "Holy Jab",
					attack: true,
				},
				{
					name: "Righteous Indignation",
					description: "Confidently charge forth and pierce through your foe.",
					cost: 30,
					estatus: ["🩸"],
					pstatus: ["💢"],
					damage: 2.55,
					attack: true
				},
				{
					name: "Rally Self",
					cost: 30,
					description: "Declare your utter refusal to give up and convince yourself victory is possible.",
					pstatus: ["✨", "🏳️", "🍀", "🎯"],
					health: 0.1,
					attack: false
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination.",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Cursed Bone Bow",
			maxlvl: 50,
			minlvl: 32,
			description: `An unholy weapon made from the bones of the dead with a mysterious ability to make arrows poisonous if shot in quick succession.`,
			attack: 10,
			plvlmult: 2,
			crit: 0.25,
			drop: 0.01,
			chest: 4,
			skills: [
				{
					name: "Quick Shot",
					attack: true,
				},
				{
					name: "Fatal Shot",
					cost: 40,
					description: "Unleash a powerful shot that weakens the enemy.",
					estatus: ["🩸", "🌀"],
					pstatus: ["🍀", "🎯", "💪"],
					damage: 2,
					attack: true
				},
				{
					name: "Poisoned Barrage",
					cost: 25,
					description: "Rapidly fire arrows, inciting the bow's poisonous ability.",
					estatus: ["💀"],
					damage: 0.30,
					times: 5,
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Cursed Fangs",
			maxlvl: 50,
			minlvl: 32,
			description: `A dual-weilded cursed dagger weapons made from the fangs of vampires and coated in demonic spiders venom to create a truly horrific combo.`,
			attack: 30,
			plvlmult: 2.15,
			crit: 0.2,
			drop: 0.01,
			chest: 5,
			skills: [
				{
					name: "Dual Stab",
					damage: 0.5,
					times: 2,
					attack: true,
				},
				{
					name: "Wounding Slash",
					cost: 40,
					description: "A powerful slash that ripis through the foe.",
					damage: 2,
					estatus: ["🩸"],
					attack: true
				},
				{
					name: "Draining Stabs",
					cost: 35,
					description: "Drive your fangs into your foe draining their blood and seeping poison into them.",
					estatus: ["🌀", "💀"],
					pstatus: ["🎯", "💪", "🍀"],
					damage: 0.8,
					times: 2,
					health: 0.1,
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Evil Pulverizer",
			maxlvl: 50,
			minlvl: 38,
			description: `A holy hammer apparently used by the most righteous as a way for a quick end to evil to limit the suffering of all.`,
			attack: 50,
			plvlmult: 1.5,
			crit: 0.2,
			drop: 0.01,
			chest: 5,
			skills: [
				{
					name: "Bash",
					attack: true,
				},
				{
					name: "Almightly Smite",
					cost: 55,
					description: "Jump and crush your foe with all your strength aided by gravity.",
					damage: 4,
					estatus: ["🌀", "🔥"],
					attack: true
				},
				{
					name: "Quick Prayer",
					cost: 40,
					description: "Stop to quickly pray for strength and forgiveness for your enemy.",
					estatus: ["✨"],
					pstatus: ["💢", "🏳️", "💪", "🎯", "💗"],
					attack: false
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination.",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Demonic Nunchucks",
			maxlvl: 50,
			minlvl: 40,
			description: `A weapon once used by highly talented demons that practiced martial arts.`,
			attack: 40,
			plvlmult: 2.5,
			crit: 0.3,
			drop: 0.01,
			chest: 5,
			skills: [
				{
					name: "Strike",
					attack: true,
				},
				{
					name: "Blazing Fury",
					description: "Ignite your weapon before unleashing a blazing series of attacks.",
					cost: 45,
					damage: 0.45,
					pstatus: ["💢"],
					estatus: ["🏴", "🖤", "🔥"],
					attack: true
				},
				{
					name: "Warm Up",
					cost: 40,
					description: "Unleash a series of attacks against your enemy that doubles as a warm up.",
					damage: 0.2,
					times: 4,
					pstatus: ["💪", "🍀", "🎯"],
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Holy Arts",
			maxlvl: 50,
			minlvl: 40,
			description: `An ancient art of imbuing your body with holy energy to smite foes with your bare hands, unfortunately you could only learn how to kick with it.`,
			attack: 40,
			plvlmult: 2,
			crit: 0.4,
			drop: 0.05,
			chest: 5,
			skills: [
				{
					name: "Holy Kick",
					attack: true
				},
				{
					name: "Holy Flying Kick",
					description: "Leap forth to deliver a devastating kick imbued with holy energy to the foe.",
					cost: 55,
					damage: 2.75,
					pstatus: ["💪"],
					estatus: ["🔥"],
					attack: true
				},
				{
					name: "Holy Spartan Kick",
					description: "Imbue your leg with holy energy before unleashing a powerful kick to your foe.",
					cost: 40,
					damage: 1.8,
					estatus: ["🔥", "🌀", "💫"],
					pstatus: ["🎯", "🏳️", "🛡️"],
					attack: true
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination.",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Orcus",
			maxlvl: 50,
			minlvl: 45,
			description: `A weapon of devastating power fabled to once been wielded by the bringer of death himself. The mere presence of this weapon siphons the life from the area.`,
			attack: 85,
			plvlmult: 2.3,
			crit: 0.5,
			drop: 0.01,
			chest: 5,
			skills: [
				{
					name: "Scythe",
					damage: 1,
					estatus: ["🩸"],
					attack: true,
				},
				{
					name: "Destined Death",
					cost: 65,
					description: "Focus immense power into the Orcus before swinging it to unleash a condensed wave of cursed energy.",
					damage: 4,
					estatus: ["🏴", "🖤"],
					pstatus: ["🏳️", "💢"],
					attack: true
				},
				{
					name: "Draining Slash",
					cost: 35,
					description: "A heavy strike that steals the life of the enemy to invigorate the wielder.",
					damage: 2.25,
					estatus: ["🩸"],
					pstatus: ["💪"],
					health: 0.1,
					attack: true
				},
				{
					name: "Dark Reconstruction",
					cost: 40,
					description: "Engulfs the user in a black substance that seems to replace missing parts and reconfigure their body to partial intagibility.",
					health: 0.45,
					pstatus: ["💨"],
					attack: false
				}
			]
		},
		{
			name: "Iris & Hermes",
			maxlvl: 50,
			minlvl: 45,
			description: `A weapon also known simply as the Holy Messengers, thought to be made for cleansing the world of evil and anything else that threatens the balance.`,
			attack: 45,
			plvlmult: 2.3,
			crit: 0.3,
			drop: 0.01,
			chest: 5,
			skills: [
				{
					name: "Quick Shot",
					damage: 1,
					pstatus: ["🎯"],
					attack: true,
				},
				{
					name: "Twin Banishing Shot",
					cost: 50,
					description: "Supercharge Iris & Hermes to fire a bright and powerful beam of holy energy from each barrle.",
					estatus: ["👁️", "🩸"],
					damage: 2,
					times: 2,
					attack: true
				},
				{
					name: "Sacred Barrage",
					cost: 30,
					description: "Receive a minor blessing and fire off a quick burst of holy blasts at the enemy.",
					estatus: ["🔥"],
					pstatus: ["🍀", "💪"],
					damage: 0.2,
					times: 8,
					attack: true
				},
				{
					name: "Holy Restoration",
					cost: 40,
					description: "Receieve a major blessing and restore health to the user.",
					pstatus: ["✨", "🛡️", "💗"],
					health: 0.25,
					attack: false
				}
			]
		},
		{
			name: "Alectrona & Melanie",
			maxlvl: 50,
			minlvl: 45,
			description: `Two legendary swords of conflicting power brought together in an irrational combo. Can you truly harness the power of light & dark without consequence?`,
			attack: 55,
			plvlmult: 2.5,
			crit: 0.35,
			drop: 0.01,
			chest: 5,
			skills: [
				{
					name: "Dual Strike",
					damage: 0.5,
					times: 2,
					attack: true,
				},
				{
					name: "Yin or Yang",
					cost: 55,
					description: "Point Melanie or Alectrona upwards then unleashes its power which creates a massive blade of lightor darkness before slamming it down on to the enemy and strengthening its wielder.\n\nRandomized for each turn:, inflict Cursed, Bad Omen, and Weakness\nOR\ninflict Burn, Blindness, and Bleed.\n\nThen, Gain Berserk\nOR\nGain Blessed and Empowerment",
					damage: 3,
					estatus: [["🖤", "🏴", "🌀"], ["🔥", "🩸", "👁️"]][Math.floor(Math.random() * 2)],
					pstatus: [["💢", "🏳️"], ["✨", "🍀", "🛡️"]][Math.floor(Math.random() * 2)],
					attack: true
				},
				{
					name: "Exalted Flash",
					cost: 35,
					description: "Unleash insanely fast identical strikes that strengthens the wielder.",
					damage: 0.4,
					times: 4,
					pstatus: ["🎯", "💪"],
					attack: true
				},
				{
					name: "Meditation",
					cost: 40,
					description: "User partially stabilizes the cursed and holy energy swirling within them from the two swords.",
					pstatus: ["💗", "💪"],
					health: 0.1,
					attack: false
				}
			]
		},

		// ARMOR

		{
			name: "T-Shirt",
			description: "Go commando.",
			armor: 0,
			plvlmult: 0,
			minlvl: 1,
			alvlmult: 0,
			evasion: 0,
			encounter: 0
		},
		{
			name: "Tattered Rags",
			description: "Torn clothing together enough to cover the most important part and keep warm.",
			armor: 27,
			plvlmult: 5,
			maxlvl: 10,
			minlvl: 1,
			alvlmult: 1,
			evasion: 0.06,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Twig",
					name: "Light",
					evasion: 0.025,
				},
				{
					weapon: "Branch",
					name: "Thick",
					armor: 5,
				},
			]
		},
		{
			name: "Damaged Cloak",
			description: "A brown cloak that seems to have been used extensively based on the heavily faded color and abundant tears",
			armor: 42,
			plvlmult: 5,
			maxlvl: 10,
			minlvl: 1,
			alvlmult: 2,
			evasion: 0.05,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Broken Dagger",
					name: "Jagged Edge",
					critical: 0.025,
				},
				{
					weapon: "Rusty Dagger",
					name: "Thick",
					armor: 5,
				},
			]
		},
		{
			name: "Rogues Cloak",
			description: "A brown cloak that's still in good condition that should provide light protection due to it's a strong fabric",
			armor: 5,
			plvlmult: 5,
			maxlvl: 12,
			minlvl: 4,
			alvlmult: 2,
			evasion: 0.09,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Trusty Dagger",
					name: "Light",
					evasion: 0.025,
				},
			]
		},
		{
			name: "The Perfect Leaf",
			description: "A leaf with a vibrant hue of green, no missing leaves, damage, and a impressive shape that seems completely symmetrical it must be special.",
			armor: 47,
			plvlmult: 5,
			maxlvl: 12,
			minlvl: 4,
			alvlmult: 1,
			evasion: 0.13,
			encounter: 0.05,
			synergies: [
				{
					weapon: "The Perfect Stick",
					name: "Light",
					evasion: 0.025,
				},
			]
		},
		{
			name: "Padded Clothing",
			description: "Multiple layers of normal clothing sown together to create a thick set shirt and pants , simple but surprisingly effective.",
			armor: 17,
			plvlmult: 5,
			maxlvl: 14,
			minlvl: 6,
			alvlmult: 2,
			evasion: 0.07,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Iron Short Sword",
					name: "Hide",
					armor: 10,
				},
			]
		},
		{
			name: "Confidence",
			description: "Who needs armor or even clothing for that fact when you have such a magnificently strong body and mind? Clearly not you since you're just that impressive of an individual.",
			armor: 198,
			plvlmult: 5,
			maxlvl: 45,
			minlvl: 25,
			alvlmult: 10,
			evasion: 0.30,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Golden Stick",
					name: "Powerful",
					attack: 35
				},
			]
		},
		{
			name: "Leather Armor",
			description: "A set of armor made from the tough hide of some kind of unlucky animal which provides good protect from a variety of attacks.",
			armor: 10,
			plvlmult: 5,
			maxlvl: 24,
			minlvl: 13,
			alvlmult: 4,
			evasion: 0.12,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Dual Daggers",
					name: "Light",
					evasion: 0.05,
				},
				{
					weapon: "Dual Hatchets",
					name: "Brute",
					attack: 15
				},
			]
		},
		{
			name: "Light Armor",
			description: "A set of leather armor that comes with a small set of metal coverings protecting most vital spots.",
			armor: 3,
			plvlmult: 5,
			maxlvl: 28,
			minlvl: 15,
			alvlmult: 7,
			evasion: 0.09,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Iron Sword",
					name: "Tough",
					armor: 15,
				},
			]
		},
		{
			name: "Hunter Cloak",
			description: "A set of very light armor made from leather that provides decent protection without inhibiting mobility, topped of with a dark green cloak that conceals movement and provides even more protection.",
			armor: 70,
			plvlmult: 5,
			maxlvl: 32,
			minlvl: 19,
			alvlmult: 6,
			evasion: 0.25,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Wooden Bow",
					name: "Targeted",
					critical: 0.05,
				},
			]
		},
		{
			name: "Assassin's Cloak",
			description: "A black cloak made from a very light material with a set of padded clothing underneath.",
			armor: 25,
			plvlmult: 5,
			maxlvl: 32,
			minlvl: 19,
			alvlmult: 7,
			evasion: 0.10,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Silver Dagger",
					name: "Swift",
					evasion: 0.05,
				},
			]
		},
		{
			name: "Lumberjack Atire",
			description: "A plaid long shirt and extra large black jeans a combo that just feels right for some unknown reason.",
			armor: 9,
			plvlmult: 5,
			maxlvl: 38,
			minlvl: 26,
			alvlmult: 14,
			evasion: 0.08,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Lumberjack Axe",
					name: "Strong",
					armor: 20,
				},
			]
		},
		{
			name: "Thick Sleeveless Hoodie",
			description: "A very large black hoodie that had it's sleeves cut off with a pair of baggy jeans.",
			armor: 105,
			plvlmult: 5,
			maxlvl: 40,
			minlvl: 25,
			alvlmult: 9,
			evasion: 0.20,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Martial Arts",
					name: "Targeted",
					critical: 0.05,
				},
			]
		},
		{
			name: "Leather Apron & Mask",
			description: "A stained apron made from leather and cloth facial covering that shields your nose and mouth.",
			armor: 270,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 26,
			alvlmult: 19,
			evasion: 0.14,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Chainsaw",
					name: "Relentless",
					critical: 0.1,
				},
			]
		},
		{
			name: "Iron Armor",
			description: "A full set of iron armor that protects your body from the neck down at the cost of mobility.",
			armor: 10,
			plvlmult: 5,
			maxlvl: 38,
			minlvl: 26,
			alvlmult: 15,
			evasion: 0.0,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Great Sword",
					name: "Heavy",
					armor: 25,
				},
				{
					weapon: "Skull Crusher",
					name: "Strong",
					attack: 20
				},
			]
		},
		{
			name: "Dragon Cloak",
			description: "A stylish jet-black cloak made from a extremely durable material rumored to actually be acquired by slaying a black dragon.",
			armor: 60,
			plvlmult: 5,
			maxlvl: 40,
			minlvl: 30,
			alvlmult: 12,
			evasion: 0.15,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Twin Swords",
					name: "Sharp",
					critical: 0.075,
				},
			]
		},
		{
			name: "Spiked Leather Armor",
			description: "Leather armor that's thin at the joints and extremely thick at vitals providing a mix of both maneuverability and protection. Having the mini spikes on it is mostly a bonus.",
			armor: 21,
			plvlmult: 5,
			maxlvl: 40,
			minlvl: 30,
			alvlmult: 17,
			evasion: 0.13,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Spiked Gauntlents",
					name: "Strength",
					attack: 20
				},
			]
		},
		{
			name: "Shinobi Garments",
			description: "The traditionally attire of those who practice ninjutsu consisting of a black jacket, black trousers, light sandals, and a hooded cowl.",
			armor: 244,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 30,
			alvlmult: 16,
			evasion: 0.15,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Ninja Arts",
					name: "Illusive",
					evasion: 0.015,
				},
			]
		},
		{
			name: "Holy Knight's Armor",
			description: "A shiny suit of iron armor that's been blessed by the holy church and made from the finest iron",
			armor: 272,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 30,
			alvlmult: 24,
			evasion: 0.07,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Holy Spear",
					name: "Unbreakable",
					armor: 50,
				},
				{
					weapon: "Evil Pulverizer",
					name: "Powerful",
					attack: 35
				},
			]
		},
		{
			name: "Coat of Darkness",
			description: "WORK IN PROGRESS",
			armor: 244,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 30,
			alvlmult: 16,
			evasion: 0.15,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Cursed Bone Bow",
					name: "Relentless",
					critical: 0.1,
				},
				{
					weapon: "Cursed Fangs",
					name: "Relentless",
					critical: 0.1,
				},
			]
		},
		{
			name: "Blessed Gi",
			description: "A martial artist Gi that has been extensively blessed by the church till it's been imbued holy energy.",
			armor: 247,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 40,
			alvlmult: 28,
			evasion: 0.14,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Holy Arts",
					name: "Reinforced",
					armor: 35,
				},
			]
		},
		{
			name: "Sinner Jacket",
			description: "EXAMPLE",
			armor: 261,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 40,
			alvlmult: 19,
			evasion: 0.23,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Demonic Nunchucks",
					name: "Relentless",
					critical: 0.1,
				},
			]
		},
		{
			name: "Walking Church",
			description: "A sacred treasure of the Holy Church, it's a priest robe bestowed with a blessing of protection of the highest grade that virtually makes the robe indestructible while protecting the wearer from most forms of damage.",
			armor: 250,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 45,
			alvlmult: 37,
			evasion: 0.0,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Iris & Hermes",
					name: "Dead Eye",
					critical: 0.15,
				},
			]
		},
		{
			name: "Black Mourning",
			description: "A black hooded cloak that's constantly secreting a black fog that's unnaturally cold to the touch. Instincts alone is enough to know this isn't a normal cloak...",
			armor: 47,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 45,
			alvlmult: 20,
			evasion: 0.25,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Orcus",
					name: "Illusive",
					evasion: 0.015,
				},
			]
		},
		{
			name: "Equinox",
			description: "EXAMPLE",
			armor: 247,
			plvlmult: 5,
			maxlvl: 50,
			minlvl: 45,
			alvlmult: 24,
			evasion: 0.15,
			encounter: 0.05,
			synergies: [
				{
					weapon: "Alectrona & Melanie",
					name: "Unstoppable",
					evasion: 0.015,
					attack: 50
				},
			]
		},
		// Stamina
		{
			name: "Light Stamina Potion",
			stamina: 0.15,
			battle: true
		},
		{
			name: "Medium Stamina Potion",
			stamina: 0.3,
			battle: true,
			craft: ["Yellow Goo", "Water Flask"]
		},
		{
			name: "Heavy Stamina Potion",
			stamina: 0.5,
			battle: true,
			craft: ["Yellow Goo", "Milk", "Empty Flask"]
		},
		{
			name: "Great Stamina Potion",
			stamina: 0.7,
			battle: true,
			craft: ["Yellow Goo", "Witch Crystal", "Milk", "Empty Flask"]
		},
		{
			name: "Grand Stamina Potion",
			stamina: 0.9,
			battle: true
		},
		// Health
		{
			name: "Light Health Potion",
			health: 0.15,
			battle: true
		},
		{
			name: "Medium Health Potion",
			health: 0.3,
			battle: true,
			craft: ["Green Goo", "Water Flask"]
		},
		{
			name: "Heavy Health Potion",
			health: 0.5,
			battle: true,
			craft: ["Green Goo", "Egg", "Empty Flask"]
		},
		{
			name: "Great Health Potion",
			health: 0.7,
			battle: true,
			craft: ["Green Goo", "Vampire Fang", "Egg", "Empty Flask"]
		},
		{
			name: "Grand Health Potion",
			health: 0.9,
			battle: true
		},
		// Defense
		{
			name: "Light Defense Potion",
			defense: 0.15,
			battle: true
		},
		{
			name: "Medium Defense Potion",
			defense: 0.3,
			battle: true,
			craft: ["Blue Goo", "Water Flask"]
		},
		{
			name: "Heavy Defense Potion",
			defense: 0.5,
			battle: true,
			craft: ["Blue Goo", "Egg", "Empty Flask"]
		},
		{
			name: "Great Defense Potion",
			defense: 0.7,
			battle: true,
			craft: ["Gret Goo", "Demon Horn", "Egg", "Empty Flash"]
		},
		{
			name: "Grand Defense Potion",
			defense: 0.9,
			battle: true
		},
		// Attack
		{
			name: "Light Attack Potion",
			buff: 0.15,
			battle: true
		},
		{
			name: "Medium Attack Potion",
			buff: 0.3,
			battle: true,
			craft: ["Red Goo", "Water Flask"]
		},
		{
			name: "Heavy Attack Potion",
			buff: 0.5,
			battle: true,
			craft: ["Red Goo", "Milk", "Empty Flask"]
		},
		{
			name: "Great Attack Potion",
			buff: 0.7,
			battle: true,
			craft: ["Red Goo", "Werewolf Claw", "Milk", "Empty Flash"]
		},
		{
			name: "Grand Attack Potion",
			buff: 0.9,
			battle: true
		},
		// Energy
		{
			name: "Light Energy Potion",
			health: 0.15,
			stamina: 0.15,
			battle: true
		},
		{
			name: "Medium Energy Potion",
			health: 0.15,
			stamina: 0.3,
			battle: true
		},
		{
			name: "Heavy Energy Potion",
			health: 0.15,
			stamina: 0.5,
			battle: true
		},
		{
			name: "Great Energy Potion",
			health: 0.15,
			stamina: 0.7,
			battle: true
		},
		{
			name: "Grand Energy Potion",
			health: 0.15,
			stamina: 0.9,
			battle: true
		},
		// XP
		{
			name: "Light XP Potion",
			xp: 638
		},
		{
			name: "Medium XP Potion",
			xp: 5740
		},
		{
			name: "Heavy XP Potion",
			xp: 15943
		},
		{
			name: "Great XP Potion",
			xp: 31250
		},
		{
			name: "Grand XP Potion",
			xp: 51658
		},
		// Chest Keys
		{
			name: "Copper Key",
			chest: 1
		},
		{
			name: "Silver Key",
			chest: 2
		},
		{
			name: "Gold Key",
			chest: 3
		},
		{
			name: "Platinum Key",
			chest: 4
		},
		{
			name: "Adamantine Key",
			chest: 5
		},
		/*
		{
			name: "Poison Potion",
			craft: ["Venom", "Booze Flask"],

			battle: true
		},
		*/
		// Craftables
		{
			name: "Molotov",
			craft: ["Cloth", "Booze Flask"],
			damage: 350,
			estatus: ["🔥"],
			battle: true
		},
		{
			name: "Ordinary Bomb",
			craft: ["Gunpowder", "Sticky Solution", "Empty Flask"],
			damage: 420,
			battle: true
		},
		{
			name: "Pepper Bomb",
			craft: ["Gunpowder", "Sticky Solution", "Empty Flask", "Pepper"],
			damage: 400,
			estatus: ["👁️"],
			battle: true
		},
		{
			name: "Shrapnel Bomb",
			craft: ["Gunpowder", "Sticky Solution", "Empty Flask", "Whetstone"],
			damage: 450,
			estatus: ["🩸"],
			battle: true
		},
		{
			name: "Purifying Flask",
			craft: ["Purified Salt", "Sticky Solution", "Water Flask"],
			battle: true
		},
		{
			name: "Purifying Water",
			craft: ["Purified Salt", "Water Flask"],
			battle: true
		},
		{
			name: "Poison Flask",
			estatus: ["💀"],
			damage: 260,
			battle: true
		},
		{
			name: "Cloth",
			craft: ["Wool", "Wool"],
			uses: ["Molotov", "Whetstone & Polish", "Wool"]
		},
		{
			name: "Purple Gem",
			craft: ["Red Gem", "Blue Gem"]
		},
		{
			name: "Sticky Solution",
			craft: ["Yellow Goo", "Green Goo", "Blue Goo", "Red Goo", "Empty Flask"]
		},
		{
			name: "Mana Infused Crystal",
			craft: ["Witch Crystal", "Werewolf Claw", "Demon Horn", "Vampire Fang"],
			uses: ["Enchanting Crystal"]
		},
		{
			name: "Enchanting Crystal",
			craft: ["Mana Infused Crystal", "Sticky Solution", "Water Flask"]
		},
		{
			name: "Purification Gem",
			craft: ["Purple Gem", "Sticky Solution", "Purifying Water"]
		},
		{
			name: "Whetstone & Polish",
			craft: ["Whetstone", "Sticky Solution", "Water Flask", "Cloth"]
		},
		// Drops
		{
			name: "Yellow Goo",
			uses: ["Stamina Potion", "Sticky Solution"]
		},
		{
			name: "Green Goo",
			uses: ["Health Potion", "Sticky Solution"]
		},
		{
			name: "Blue Goo",
			uses: ["Defense Potion", "Sticky Solution"]
		},
		{
			name: "Red Goo",
			uses: ["Attack Potion", "Sticky Solution"]
		},
		{
			name: "Pepper",
			uses: ["Pepper Bomb"]
		},
		{
			name: "Wool",
			uses: ["Cloth"]
		},
		{
			name: "Milk",
			uses: ["Heavy Stamina Potion", "Heavy Attack Potion", "Great Stamina Potion", "Great Attack Potion"]
		},
		{
			name: "Egg",
			uses: ["Heavy Health Potion", "Heavy Defense Potion", "Great Health Potion", "Great Defense Potion"]
		},
		{
			name: "Vampire Fang",
			uses: ["Great Health Potion", "Mana Infused Crystal"]
		},
		{
			name: "Demon Horn",
			uses: ["Great Defense Potion", "Mana Infused Crystal"]
		},
		{
			name: "Werewolf Claw",
			uses: ["Great Attack Potion", "Mana Infused Crystal"]
		},
		{
			name: "Witch Crystal",
			uses: ["Great Stamina Potion", "Mana Infused Crystal"]
		},
		{
			name: "Red Gem",
			uses: ["Purple Gem"]
		},
		{
			name: "Blue Gem",
			uses: ["Purple Gem"]
		},
		{
			name: "Water Flask",
			uses: ["Purifying Water", "Sticky Solution", "Whetstone & Polish", "Medium Stamina Potion", "Medium Health Potion", "Medium Defense Potion", "Medium Attack Potion"]
		},
		{
			name: "Booze Flask",
			uses: ["Molotov", "Poison Potion"]
		},
		{
			name: "Empty Flask",
			uses: ["Heavy Stamina Potion", "Heavy Health Potion", "Heavy Defense Potion", "Heavy Attack Potion", "Great Stamina Potion", "Great Health Potion", "Great Defense Potion", "Great Attack Potion", "Poison Potion", "Purifying Bomb"]
		},
		{
			name: "Venom",
			uses: ["Poison Flask"]
		},
		{
			name: "Purified Salt",
			uses: ["Purifying Water", "Purifying Flask"]
		},
		{
			name: "Gunpowder",
			uses: ["Ordinary Bomb", "Pepper Bomb", "Shrapnel Bomb"]
		},
		{
			name: "Whetstone",
			uses: ["Whetstone & Polish"]
		}
	]
}