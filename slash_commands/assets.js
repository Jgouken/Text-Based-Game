module.exports = {
	statuses: [
		{
			name: 'Fatal Poison',
			id: '💀',
			description: `Inflict 5% of Max HP damage over 3 rounds.`,
			positive: false,
			length: 3,
			use: async function(EorP, statuses, currentHealth, chatLog, name) {
				let status = statuses.find(({ id }) => id == this.id)
				currentHealth = Math.round(currentHealth - (EorP.maxHealth * 0.05))
				chatLog.push(`${name} is posioned - 💀${Math.round(EorP.maxHealth * 0.05)}`)
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
			description: `Gain 5% Max HP over 6 rounds.`,
			positive: true,
			length: 6,
			use: async function(EorP, statuses, currentHealth, chatLog, name) {
				let status = statuses.find(({ id }) => id == this.id)
				currentHealth = Math.round(currentHealth + (EorP.maxHealth * 0.05))
				chatLog.push(`${name} has regeneration - 💗${Math.round(EorP.maxHealth * 0.05)}`)
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
			description: `Inflict 15% of damage dealt over 3 rounds.`,
			positive: false,
			length: 3,
			use: async function(EorP, statuses, currentHealth, chatLog, name) {
				let status = statuses.find(({ id }) => id == this.id)
				currentHealth = Math.round(currentHealth - (status.damage * 0.15))
				chatLog.push(`${name} is bleeding - 🩸${Math.round(status.damage * 0.15)}`)
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
			description: `Inflict 5% of damage dealt over 10 rounds.`,
			positive: false,
			length: 3,
			use: async function(EorP, statuses, currentHealth, chatLog, name) {
				let status = statuses.find(({ id }) => id == this.id)
				currentHealth = Math.round(currentHealth - (status.damage * 0.05))
				chatLog.push(`${name} is burned - 🔥${Math.round(status.damage * 0.05)}`)
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
			description: `Deal 25% less damage over 3 rounds.`,
			positive: false,
			length: 3
		},
		{
			name: 'Strength',
			id: '💪',
			description: `Deal 25% more damage over 3 rounds.`,
			positive: true,
			length: 3
		},
		{
			name: 'Empowerment',
			id: '🏳️',
			description: `Deal 50% more damage over 3 rounds.`,
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
			description: `Increases armor by 20% over 3 rounds.`,
			positive: true,
			length: 3
		},
		{
			name: 'Blindness',
			id: '👁️',
			description: `Decreases accuracy by 20% over 3 rounds.`,
			positive: false,
			length: 3
		},
		{
			name: 'Focus',
			id: '🎯',
			description: `Increases accuracy by 50% over 3 rounds.`,
			positive: true,
			length: 3
		},
		{
			name: 'Curse',
			id: '🖤',
			description: `Inflict 15% of  initial damage over 8 rounds.`,
			positive: false,
			length: 8,
			use: async function(EorP, statuses, currentHealth, chatLog, name) {
				let status = statuses.find(({ id }) => id == this.id)
				currentHealth = Math.round(currentHealth - (status.damage * 0.15))
				chatLog.push(`${name} is cursed - 🖤${Math.round(status.damage * 0.15)}`)
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
			description: `Increases critical hit chance by 25% over 3 rounds.`,
			positive: true,
			length: 3
		},
		{
			name: 'Bad Luck',
			id: '🐈‍⬛',
			description: `Decreases critical hit chance by 20% over 3 rounds.`,
			positive: false,
			length: 3
		},
		{
			name: 'Berserk',
			id: '💢',
			description: `Increases attack by 50% and decreases armor by 30%.`,
			positive: true,
			length: 3
		},
		{
			name: 'Evasion',
			id: '💨',
			description: `Decreases enemy attack accuracy by 15%.`,
			positive: true,
			length: 3
		},
		{
			name: 'Blessing',
			id: '✨',
			description: `Dispel and gain immunity to all negative status effects for 5 turns. Cannot override Bad Omen.`,
			positive: true,
			length: 5,
		},
		{
			name: 'Bad Omen',
			id: '🏴',
			description: `Dispel and gain immunity to all positive status effects for 5 turns. Cannot override Blessing.`,
			positive: false,
			length: 5,
		},

	],

	enemies: [
		{
			name: `Lazy Goblin`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1117502969370382366/New_Piskel_4_2.gif',
			weapon: "rusted dagger",
			maxHealth: 50,
			attack: 10,
			accuracy: 0.75,
			critical: 0.05,
			defense: Math.round(Math.random()),
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
			]
		},
		{
			name: `Blacksmith Goblin`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "blacksmith hammer",
			maxHealth: 75,
			attack: 30,
			accuracy: 0.8,
			critical: 0.05,
			defense: Math.round(Math.random() * 2),
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
			]
		},
		{
			name: `Armorer Goblin`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "spear & shield",
			maxHealth: 100,
			attack: 20,
			accuracy: 0.75,
			critical: 0.08,
			defense: Math.floor(Math.random() * (5 - 2) + 2),
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
			]
		},
		{
			name: `Cursed Goblin`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "cursed rusted dagger",
			accuracy: 0.75,
			critical: 0.08,
			maxHealth: 75,
			defense: Math.floor(Math.random() * (4 - 1) + 1),
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
			]
		},
		{
			name: `Orc`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "orc club",
			accuracy: 0.65,
			critical: 0.1,
			maxHealth: 150,
			attack: 50,
			defense: Math.floor(Math.random() * (4 - 2) + 2),
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
			]
		},
		{
			name: `Health Slime`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 1,
			critical: 0.1,
			maxHealth: 150,
			attack: 10,
			defense: 0,
			skills: [
				{
					name: "Jump",
					chance: 0.65,
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
					health: 0.75,
					chance: 0.025,
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
			]
		},
		{
			name: `Attack Slime`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.75,
			critical: 0.07,
			maxHealth: 50,
			attack: 50,
			defense: 0,
			skills: [
				{
					name: "Jump",
					chance: 0.68,
					attack: true
				},
				{
					name: "Lunge",
					pstatus: ["🩸"],
					chance: 0.08,
					attack: true
				},
				{
					name: "Burning Slide",
					pstatus: ["🔥"],
					chance: 0.08,
					attack: false
				},
				{
					name: "Slime Secretion",
					pstatus: ["💀"],
					chance: 0.08,
					attack: false
				},
				{
					name: "Slime Secretion",
					estatus: ["💪"],
					chance: 0.08,
					attack: false
				},
			]
		},
		{
			name: `Defense Slime`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1116446666917158932/New_Piskel_2_1.gif',
			weapon: null,
			maxHealth: 50,
			attack: 20,
			accuracy: 0.85,
			critical: 0.05,
			defense: Math.floor(Math.random() * (7 - 5) + 5),
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
			]
		},
		{
			name: `Stamina Slime`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.8,
			critical: 0.05,
			maxHealth: 50,
			attack: 25,
			defense: Math.floor(Math.random() * (2 - 1) + 1),
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
			]
		},
		{
			name: `Orange Fox`,
			sprite: 'https://media.discordapp.net/attachments/1116445708279615641/1117522664253300907/New_Piskel_4_2_1.gif',
			weapon: "steel dagger",
			accuracy: 0.8,
			critical: 0.1,
			maxHealth: 125,
			attack: 30,
			defense: Math.floor(Math.random() * (3 - 1) + 1),
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
					pstatus: ["👁️"],
					estatus: ["🎯"],
					chance: 0.1,
					attack: false
				},
				{
					name: "Double Strike",
					times: 2,
					chance: 0.15,
					attack: true
				},
			]
		},
		{
			name: `White Fox`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "steel dagger",
			accuracy: 0.8,
			critical: 0.1,
			maxHealth: 125,
			attack: 25,
			defense: Math.floor(Math.random() * (3 - 2) + 2),
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
					pstatus: ["👁️"],
					estatus: ["🎯"],
					chance: 0.1,
					attack: false
				},
				{
					name: "Double Strike",
					times: 5,
					damage: 0.5,
					chance: 0.15,
					attack: true
				},
			]
		},
		{
			name: `Blue Fox`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "steel dagger",
			accuracy: 0.8,
			critical: 0.1,
			maxHealth: 150,
			attack: 30,
			defense: Math.floor(Math.random() * (3 - 2) + 2),
			skills: [
				{
					name: "Stab",
					chance: 0.6,
					attack: true
				},
				{
					name: "Smoke Bomb",
					pstatus: ["👁️"],
					chance: 0.15,
					attack: false,
					wait: 3
				},
				{
					name: "Swift Movement",
					pstatus: ["👁️"],
					estatus: ["🎯"],
					chance: 0.1,
					attack: false
				},
				{
					name: "Onslaught",
					times: 10,
					damage: 0.25,
					chance: 0.05,
					attack: true
				},
				{
					name: "Fatal Slash",
					pstatus: ["🩸", "💀"],
					chance: 0.1,
					attack: true
				},
			]
		},
		{
			name: `Vampire`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: "fangs",
			accuracy: 0.95,
			critical: 0.2,
			maxHealth: 90,
			attack: 40,
			defense: Math.floor(Math.random() * 6),
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
			]
		},
		{
			name: `Demon`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.85,
			critical: 0.15,
			maxHealth: 100,
			attack: 50,
			defense: Math.floor(Math.random() * (6 - 2) + 2),
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
			]
		},
		{
			name: `Werewolf`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.8,
			critical: 0.25,
			maxHealth: 125,
			attack: 45,
			defense: Math.floor(Math.random() * 4),
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
			]
		},
		{
			name: `Witch`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.9,
			critical: 0.05,
			maxHealth: 75,
			attack: 45,
			defense: Math.floor(Math.random() * 3),
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
			]
		},
		{
			name: `Cow`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.5,
			critical: 0.1,
			maxHealth: 10,
			attack: 15,
			defense: Math.floor(Math.random() * 1),
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
			]
		},
		{
			name: `Sheep`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.5,
			critical: 0.1,
			maxHealth: 20,
			attack: 0,
			defense: Math.floor(Math.random() * 2),
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
			]
		},
		{
			name: `Chicken`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.5,
			critical: 0.1,
			maxHealth: 5,
			attack: 10,
			defense: 0,
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
			]
		},
		{
			name: `Cyclops Overlord`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.8,
			critical: 0.15,
			maxHealth: 250,
			attack: 100,
			defense: Math.floor(Math.random() * (9 - 6) + 6),
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
			]
		},
		{
			name: `Fox King`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 1,
			critical: 0.15,
			maxHealth: 225,
			attack: 150,
			defense: Math.floor(Math.random() * (7 - 4) + 4),
			skills: [
				{
					name: "Stab",
					chance: 0.6,
					attack: true
				},
				{
					name: "Smoke Bomb",
					pstatus: ["👁️", "🏴"],
					chance: 0.15,
					attack: false,
					wait: 3
				},
				{
					name: "Swift Movement",
					estatus: ["🎯"],
					pstatus: ["👁️"],
					chance: 0.1,
					attack: false,
					wait: 3
				},
				{
					name: "Onslaught",
					damage: 0.25,
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
			]
		},
		{
			name: `Goblin King`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.9,
			critical: 0.15,
			maxHealth: 300,
			attack: 175,
			defense: Math.floor(Math.random() * (7 - 5) + 5),
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
			]
		},
		{
			name: `Demon Queen`,
			sprite: 'https://media0.giphy.com/media/hS42TuYYnANLFR9IRQ/giphy.gif?cid=6c09b952a0cecfa2e65767266c0ca341e9b9222c2dba7ec2&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=ts',
			weapon: null,
			accuracy: 0.99,
			critical: 0.15,
			maxHealth: 500,
			attack: 250,
			defense: Math.floor(Math.random() * (10 - 9) + 9),
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
			]
		},
	],

	weapons: [
		{
			name: "2-Piece No Sauce",
			level: 1,
			description: `These hands.`,
			attack: 0,
			plvlmult: 1,
			crit: 0,
			drop: 0,
			skills: [
				{
					name: "Punch",
					attack: true
				},
				{
					name: "Knuckle Sandwich",
					cost: 2,
					description: "A complementary can of whoop-ass. Deal 110% damage.",
					damage: 1.1,
					attack: true
				},
				{
					name: "Kick",
					cost: 3,
					description: "A complementary can of kick-ass. Deal 120% damage.",
					damage: 1.2,
					attack: true
				},
				{
					name: "Relieve",
					cost: 5,
					description: "Stop and crack your knuckles. Gain Regeneration.",
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Twig",
			level: Math.floor(Math.random() * (5 - 1) + 1),
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
					description: `Poke 'em in the eye. Deal 90% damage and inflicts Blindness`,
					cost: 5,
					damage: 0.9,
					estatus: ["👁️"],
					attack: true
				},
				{
					name: "Thwack",
					description: `Thwack them with your stick! Deal 120% damage`,
					cost: 8,
					damage: 1.2,
					attack: true
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds. Recover 15% of max health`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Branch",
			level: Math.floor(Math.random() * (8 - 1) + 1),
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
					description: `Batter up! Deal 140% damage`,
					cost: 10,
					damage: 1.4,
					attack: true
				},
				{
					name: "Barbaric Shout",
					description: `Scream at the top of your lungs. Gain Strength`,
					pstatus: ["💪"],
					cost: 6,
					attack: false
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds. Recover 15% health`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Broken Dagger",
			level: Math.floor(Math.random() * (10 - 2) + 2),
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
					description: `Hope for the best. Gain Luck`,
					cost: 9,
					pstatus: ["🍀"],
					attack: false
				},
				{
					name: "Wild Stab",
					description: `Deal 130% damage and inflict Bleed`,
					estatus: ["🩸"],
					damage: 1.3,
					cost: 12,
					attack: true
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds. Recover 15% health`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Rusty Dagger",
			level: Math.floor(Math.random() * (10 - 4) + 4),
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
					description: `Slice with ferocity. Deal 150% damage`,
					cost: 12,
					damage: 1.5,
					attack: true
				},
				{
					name: "Kick",
					description: `Give 'em a roundhouse kick in the face! Deal 85% damage and inflict Stun and Weakness`,
					estatus: ["💫", "🌀"],
					damage: 0.85,
					cost: 15,
					attack: true
				},
				{
					name: "Treat Wounds",
					description: `Rub some dirt on your wounds. Recover 15% health`,
					cost: 20,
					health: 0.15,
					attack: false
				},
			]
		},
		{
			name: "Trusty Dagger",
			level: Math.floor(Math.random() * (12 - 6) + 6),
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
					description: `Slash with ferocity. Deal 3 repeated attacks at 75% damage`,
					cost: 13,
					damage: 0.75,
					estatus: ["🩸"],
					times: 3,
					attack: true
				},
				{
					name: "Swift Attack",
					description: `Stab faster than they can see! Deal 110% damage, inflict Blindness, and gain Luck`,
					cost: 9,
					estatus: ["👁️"],
					pstatus: ["🍀"],
					damage: 1.1,
					attack: true
				},
				{
					name: "Quick Fix",
					description: `Wrap your wound in cloth. Recover 10% health`,
					cost: 15,
					health: 0.1,
					attack: false
				},
			]
		},
		{
			name: "The Perfect Stick",
			level: Math.floor(Math.random() * (12 - 6) + 6),
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
					description: `With the perfect trajectory, deal 125% damage and gain Strength`,
					cost: 20,
					damage: 1.25,
					pstatus: ["💪"],
					attack: true
				},
				{
					name: "All or Nothing",
					description: `Put all your eggs in one basket and deal 325% damage but gain Stun`,
					cost: 9,
					pstatus: ["💫"],
					damage: 3.25,
					attack: true
				},
				{
					name: "Quick Fix",
					description: `Wrap your wound in cloth. Recover 10% health`,
					cost: 15,
					health: 0.1,
					attack: false
				},
			]
		},
		{
			name: "Iron Short Sword",
			level: Math.floor(Math.random() * (14 - 6) + 6),
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
					description: `Deal 90% damage twice`,
					cost: 15,
					times: 2,
					damage: 0.9,
					attack: true
				},
				{
					name: "Warrior's Resolve",
					description: `Gain Regeneration and Strength`,
					cost: 20,
					pstatus: ["💗", "💪"],
					attack: false
				},
				{
					name: "Kick",
					description: `Deal 85% damage and inflict Stun and Weakness`,
					estatus: ["💫", "🌀"],
					cost: 15,
					damage: 0.85,
					attack: true
				},
			]
		},
		{
			name: "Golden Stick",
			level: Math.floor(Math.random() * (45 - 25) + 25),
			description: `The absolute perfect stick with no imperfections. Made from a wood that is as shiny as gold.`,
			attack: 25,
			plvlmult: 1.5,
			crit: 0.2,
			drop: 0.01,
			chest: 4,
			skills: [
				{
					name: "Golden Whack",
					attack: true
				},
				{
					name: "Golden Rush",
					description: `Bother the enemy to the finest several times. Deal 77% damage 7 times`,
					cost: 25,
					times: 7,
					damage: 0.77,
					attack: true
				},
				{
					name: "Brandish",
					description: `Show off your weapon and use it to reflect light into the enemy's eye. Inflict Blindness and Weakness and gain Berserk and Luck`,
					cost: 30,
					pstatus: ["💢", "🍀"],
					estatus: ["👁️", "🌀"],
					attack: false
				},
				{
					name: "Golden Standard",
					description: `Recover 25% health and gain Empowerment, Blessing, and Focus`,
					pstatus: ["🏳️", "✨", "🎯"],
					cost: 20,
					haelth: 0.25,
					attack: false
				},
			]
		},
		{
			name: "Dual Daggers",
			level: Math.floor(Math.random() * (24 - 13) + 13),
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
					description: `Unleash a quick barrage of slashes. Deal 45% damage 7 times and inflict Bleed.`,
					cost: 16,
					times: 7,
					damage: 0.45,
					attack: true
				},
				{
					name: "Rogue’s Gambit",
					description: `Inflict Blindness and Weakness and gain Regeneration, Berserk, and Luck`,
					cost: 14,
					pstatus: ["🍀"],
					attack: false
				},
				{
					name: "Quick Fix",
					description: `Wrap your wound in cloth. Recover 10% health`,
					cost: 15,
					health: 0.1,
					attack: false
				},
			]
		},
		{
			name: "Dual Hatchets",
			level: Math.floor(Math.random() * (24 - 13) + 13),
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
					description: "Strike the axes together and rush the enemy. Deal 80% damage 3 times and inflict Burning",
					cost: 16,
					damage: 0.8,
					times: 3,
					attack: true
				},
				{
					name: "Berserker's Cry",
					description: "Let out an intimidating should. Inflicts Weakness and gains Berserk, Focus, and Strength",
					cost: 15,
					pstatus: ["💢", "🎯", "💪"],
					estatus: ["🌀"],
					attack: false
				},
				{
					name: "Walk it Off",
					description: "Grit your teeth and power through the pain. Recover 35% health",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Iron Sword",
			level: Math.floor(Math.random() * (27 - 15) + 15),
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
					description: "Strike the enemy with 80% damage 3 times.",
					cost: 18,
					damage: 0.8,
					times: 3,
					attack: true
				},
				{
					name: "Knight's Resolve",
					description: "Read self for combat. Gain Strength, Regeneration, and Fortification",
					cost: 15,
					pstatus: ["💪", "💗", "🛡️"],
					attack: false
				},
				{
					name: "Kick",
					description: "Give 'em a roundhouse kick to the face. Deal 85% damage and inflict Stun and Weakness",
					cost: 15,
					estatus: ["💫", "🌀"],
					damage: 0.85,
					attack: true
				}
			]
		},
		{
			name: "Wodden Bow",
			level: Math.floor(Math.random() * (32 - 19) + 19),
			description: `A lightweight ranged weapon to get your enemies from afar.`,
			attack: 15,
			plvlmult: 1.5,
			crit: 0.25,
			drop: 0.05,
			chest: 3,
			skills: [
				{
					name: "Quick Shot",
					attack: true
				},
				{
					name: "Jackpot",
					description: "Unleash a powerful shot concentrated on an enemy's weakpoint. Deal 225% damage and inflict Weakness, Stun, and Bleeding, and gain Focus and Luck.",
					cost: 25,
					damage: 2.25,
					pstatus: ["🎯", "🍀"],
					estatus: ["🌀", "💫", "🩸"],
					attack: true
				},
				{
					name: "Rapid Barrage",
					description: "Swiftly fire multiple arrows. Deal 25% damage 9 times",
					cost: 20,
					times: 9,
					attack: true
				},
				{
					name: "Combat Heal",
					description: "Utilize medic knowledge to heal your wounds. Recover 15% health and gain Regeneration",
					cost: 25,
					health: 0.15,
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "LumberJack Axe",
			level: Math.floor(Math.random() * (32 - 19) + 19),
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
					description: "Swing your axe with full force. Deal 325% damage",
					cost: 40,
					damage: 3.25,
					attack: true,
				},
				{
					name: "Rallying Shout",
					description: "Let out a mighty yell. Gain Strength and Fortification",
					cost: 15,
					pstatus: ["💪", "🛡️"],
					attack: false
				},
				{
					name: "Hearty Breakfast",
					description: "Pull out your lunchbox and chomp down on a bacon omelet and grits. Recover 15% health and gain Empowerment and Regeneration",
					cost: 30,
					pstatus: ["🏳️", "💗"],
					attack: false
				}
			]
		},
		{
			name: "Silver Knife",
			level: Math.floor(Math.random() * (32 - 19) + 19),
			description: `A knife colored silver. Great for murder!`,
			attack: 20,
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
					description: "Quickly attack the enemy. Deal 60% damage 3 times and inflict Fatal Poison",
					cost: 15,
					times: 3,
					damage: 0.8,
					estatus: ["💀"],
					attack: true
				},
				{
					name: "Poison Cloud",
					description: "Throw a poison smoke bomb. Deal 80% damage and inflict Weakness, Blindness, and Fatal Poison",
					cost: 25,
					damage: 0.8,
					estatus: ["🌀", "👁️", "💀"],
					attack: true
				},
				{
					name: "Combat Heal",
					description: "Utilize medic knowledge to heal your wounds. Recover 15% health and gain Regeneration",
					cost: 25,
					health: 0.15,
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Martial Arts",
			level: Math.floor(Math.random() * (40 - 25) + 25),
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
					description: "A barrage of punches. Deal 40% damage 4 times and gain Focus, Strength, and Luck",
					cost: 20,
					damage: 0.4,
					pstatus: ["🎯", "💪", "🍀"],
					attack: true
				},
				{
					name: "Gut Punch",
					description: "Powerful swing to the stomach of the enemy. Deal 120% and inflict Weakness",
					cost: 20,
					damage: 1.2,
					estatus: ["🌀", "💫"],
					pstatus: ["💢"],
					attack: true
				},
				{
					name: "Walk it Off",
					description: "Grit your teeth and power through the pain. Recover 35% health",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Chainsaw",
			level: Math.floor(Math.random() * (50 - 26) + 26),
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
					description: "Charge the enemy while swinging your chainsaw. Deal 25% damage 10 times and inflict Bleed",
					estatus: ["🩸"],
					cost: 40,
					times: 10,
					damage: 0.25,
					attack: true
				},
				{
					name: "Opening Carnage",
					description: "Headbutt the enemy before swinging your chainsaw. Deal 20% damage 6 times, inflict Weakness, and gain Empowerment and Berserk",
					cost: 35,
					estatus: ["🌀"],
					pstatus: ["🏳️", "💢"],
					times: 6,
					damage: 0.2,
					attack: true
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination. Recover 40% and gain Blessing",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Great Sword",
			level: Math.floor(Math.random() * (36 - 28) + 28),
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
					description: "Send forth a powerful swing with your oversized blade. Deal 200% damage and inflict Bleed",
					cost: 25,
					damage: 2,
					estatus: ["🩸"],
					attack: true
				},
				{
					name: "Royal Knight's Resolve",
					description: "Take a stance and gather your focus to heighten your abilities. Gain Empowerment, Regeneration, and Fortification",
					cost: 30,
					pstatus: ["🏳️", "💗", "🛡️"],
					attack: false
				},
				{
					name: "Shoulder Bash",
					description: "Ram the enemy with a shoulder. Deal 45% damage, recover 10% health, and inflict Weakness.",
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
			level: Math.floor(Math.random() * (36 - 28) + 28),
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
					description: "Slam your hammer down on a foe with all your might. Deal 400% damage and inflict Weakness",
					cost: 40,
					damage: 4,
					attack: true
				},
				{
					name: "Sinister Grin",
					description: "Lower weapon and give the enemy a 2 free swings while smiling. Stuns caster and gains Berserk, Empowerment, and Strength",
					cost: 25,
					pstatus: ["💫", "💢", "🏳️", "💪"],
					attack: false
				},
				{
					name: "Walk it Off",
					description: "Grit your teeth and power through the pain. Recover 35% health",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Twin Swords",
			level: Math.floor(Math.random() * (40 - 30) + 30),
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
					description: "Unleash a swift barrage of attacks that feel very cool to do. Deal 40% damage 6 times and gain empowerment.",
					pstatus: ["🏳️"],
					cost: 25,
					times: 6,
					damage: 0.4,
					attack: true
				},
				{
					name: "Brandish",
					description: "Show off your weapon and reflect sunlight into the enemy's eye. Inflict Blindness and Weakness and gain Berserk and Luck",
					cost: 30,
					pstatus: ["💢", "🍀"],
					estatus: ["👁️"]
				},
				{
					name: "Combat Heal",
					description: "Utilize medic knowledge to heal your wounds. Recover 15% health and gain Regeneration",
					cost: 25,
					health: 0.15,
					pstatus: ["💗"],
					attack: false
				},
			]
		},
		{
			name: "Spiked Gauntlents",
			level: Math.floor(Math.random() * (40 - 30) + 30),
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
					description: "Use your hands to give the enemy a 3 piece combo with sauce. Deal 70% damage 3 times, inflict Bleed, and gain Focus and Strength",
					pstatus: ["🎯", "💪"],
					estatus: ["🩸"],
					times: 3,
					damage: 0.7,
					attack: true
				},
				{
					name: "Serve Dessert",
					cost: 25,
					description: "A powerful knee aimaed at the enemy's face. Deal 100% damage, inflict Weakness, and gain Berserk.",
					pstatus: ["💢"],
					estatus: ["🌀"],
					damage: 1.1,
					attack: true
				},
				{
					name: "Snack Break",
					description: "Pull out a protein bar and enjoy. Recover 35% health",
					cost: 25,
					health: 0.35,
					attack: false
				}
			]
		},
		{
			name: "Ninja Arts",
			level: Math.floor(Math.random() * (50 - 32) + 32),
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
					description: "A swift and precise slash through the enemy. Deal 200% damage and inflict Bleed.",
					damage: 2,
					estatus: ["🩸"],
					attack: true
				},
				{
					name: "Kunai Barrage",
					cost: 25,
					description: "Rapidly throw a variety of kunai at the foe. Deal 20% 7 times, inflict Weakness and Blindness, and gain Focus and Luck.",
					damage: 0.2,
					times: 7,
					pstatus: ["🎯", "🍀"],
					estatus: ["🌀", "👁️"],
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus. Recover 10% health and gain regeneration, evasion, and focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Holy Spear",
			level: Math.floor(Math.random() * (50 - 32) + 32),
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
					description: "Confidently charge forth and pierce through your foe. Deal 255% damage, inflict Bleed, and gain Berserk",
					cost: 30,
					estatus: ["🩸"],
					pstatus: ["💢"],
					damage: 2.55,
					attack: true
				},
				{
					name: "Rally Self",
					cost: 30,
					description: "Declare your utter refusal to give up and convince yourself victory is possible. Recover 10% and gain Blessing, Empowerment, Luck, and Focus",
					pstatus: ["✨", "🏳️", "🍀", "🎯"],
					health: 0.1,
					attack: false
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination. Recover 40% and gain Blessing",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Cursed Bone Bow",
			level: Math.floor(Math.random() * (50 - 32) + 32),
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
					description: "Unleash a powerful shot that weakens the enemy. Deal 200% damage, inflict Bleed and Weakness, gain Luck, Focus, and Strength",
					estatus: ["🩸", "🌀"],
					pstatus: ["🍀", "🎯", "💪"],
					damage: 2,
					attack: true
				},
				{
					name: "Poisoned Barrage",
					cost: 25,
					description: "Rapidly fire arrows, inciting the bow's poisonous ability. Deal 30% damage 5 times and inflict Fatal Poison.",
					estatus: ["💀"],
					damage: 30,
					times: 5,
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus. Recover 10% health and gain regeneration, evasion, and focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Cursed Fangs",
			level: Math.floor(Math.random() * (50 - 32) + 32),
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
					description: "A powerful slash that ripis through the foe. Deal 200% damage and inflict Bleed",
					damage: 2,
					estatus: ["🩸"],
					attack: true
				},
				{
					name: "Draining Stabs",
					cost: 35,
					description: "Drive your fangs into your foe draining their blood and seeping poison into them. Deal 85% damage 2 times and recover 10% health. Inflict Weakness and Fatal Poison and gain Focus, Strength, and Luck",
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
					description: "Steady your breathing and gather your focus. Recover 10% health and gain regeneration, evasion, and focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Evil Pulverizer",
			level: Math.floor(Math.random() * (50 - 38) + 38),
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
					description: "Jump and crush your foe with all your strength aided by gravity. Deal 400% and inflict Weakness and Burning",
					damage: 4,
					estatus: ["🌀", "🔥"],
					attack: true
				},
				{
					name: "Quick Prayer",
					cost: 40,
					description: "Stop to quickly pray for strength and forgiveness for your enemy. Gain Berserk, Empowerment, Strength, Focus, and Regernation but inflict Blessing",
					estatus: ["✨"],
					pstatus: ["💢", "🏳️", "💪", "🎯", "💗"],
					attack: false
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination. Recover 40% and gain Blessing",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Demonic Nunchucks",
			level: Math.floor(Math.random() * (50 - 40) + 40),
			description: `A weapon once used by highly talented demons that practiced martial arts. It has the ability to call forth the cursed flames.`,
			attack: 28,
			plvlmult: 2,
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
					description: "Ignite your weapon before unleashing a blazing series of attacks. Deal 45% damage 4 times, inflict Bad Omen, Cursed, and Burning, and gain Empowerment",
					cost: 45,
					damage: 0.45,
					pstatus: ["🏳️"],
					estatus: ["🏴", "🖤", "🔥"],
					attack: true
				},
				{
					name: "Warm Up",
					cost: 40,
					description: "Unleash a series of attacks against your enemy that doubles as a warm up. Deal 20% damage 4 times and gain Strength, Luck, and Focus",
					damage: 0.2,
					times: 4,
					pstatus: ["💪", "🍀", "🎯"],
					attack: true
				},
				{
					name: "Steady Resolve",
					cost: 30,
					description: "Steady your breathing and gather your focus. Recover 10% health and gain regeneration, evasion, and focus.",
					pstatus: ["💗", "💨", "🎯"],
					health: 0.1,
					attack: false
				}
			]
		},
		{
			name: "Holy Arts",
			level: Math.floor(Math.random() * (50 - 40) + 40),
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
					description: "Leap forth to deliver a devastating kick imbued with holy energy to the foe. Deal 275% damage, inflict Burn, Gain Strength",
					cost: 55,
					damage: 2.75,
					pstatus: ["💪"],
					estatus: ["🔥"],
					attack: true
				},
				{
					name: "Holy Spartan Kick",
					description: "Imbue your leg with holy energy before unleashing a powerful kick to your foe. Deal 180% damage, inflict stun weakness and burning, and gain empowerment, fortitude, and focus",
					cost: 40,
					damage: 1.8,
					estatus: ["🔥", "🌀", "💫"],
					pstatus: ["🎯", "🏳️", "🛡️"],
					attack: true
				},
				{
					name: "Unyielding Will",
					description: "Remain an unstoppable force through the power of uncanny determination. Recover 40% and gain Blessing",
					cost: 30,
					pstatus: ["✨"],
					health: 0.4,
					attack: false
				}
			]
		},
		{
			name: "Orcus",
			level: Math.floor(Math.random() * (50 - 45) + 45),
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
					description: "Focus immense power into the Orcus before swinging it to unleash a condensed wave of cursed energy. Deals 400% damage, inflict Weakness, Bad Omen, and Cursed, and gain Empowerment and Berserk",
					damage: 4,
					estatus: ["🌀", "🏴", "🖤"],
					pstatus: ["🏳️", "💢"],
					attack: true
				},
				{
					name: "Draining Slash",
					cost: 35,
					description: "A heavy strike that steals the life of the enemy to invigorate the wielder. Deal 225% damage, recover 10% health, inflict Bleed, and gain Strength",
					damage: 2.25,
					estatus: ["🩸"],
					pstatus: ["💪"],
					health: 0.1,
					attack: true
				},
				{
					name: "Dark Reconstruction",
					cost: 40,
					description: "Engulfs the user in a black substance that seems to replace missing parts and reconfigure their body to partial intagibility. Recover 45% health and gain Evasion",
					health: 0.45,
					pstatus: ["💨"],
					attack: false
				}
			]
		},
		{
			name: "Iris & Hermes",
			level: Math.floor(Math.random() * (50 - 45) + 45),
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
					estatus: ["🎯"],
					attack: true,
				},
				{
					name: "Twin Banishing Shot",
					cost: 50,
					description: "Supercharge Iris & Hermes to fire a bright and powerful beam of holy energy from each barrle. Beal 200% damage 2 times, inflict Blindness and Bleed",
					estatus: ["👁️", "🩸"],
					damage: 2,
					times: 2,
					attack: true
				},
				{
					name: "Sacred Barrage",
					cost: 30,
					description: "Receive a minor blessing and fire off a quick burst of holy blasts at the enemy. Deal 25% damage 8 times, inflict burning, and gain Luck and Strength",
					estatus: ["🔥"],
					pstatus: ["🍀", "💪"],
					damage: 0.25,
					times: 8,
					attack: true
				},
				{
					name: "Holy Restoration",
					cost: 40,
					description: "Receieve a major blessing and restore health to the user. Recover 25% health and gain Blessing, Fortitude, and Regeneration",
					pstatus: ["✨", "🛡️", "💗"],
					health: 0.25,
					attack: false
				}
			]
		},
		{
			name: "Alectrona & Melanie",
			level: Math.floor(Math.random() * (50 - 45) + 45),
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
					estatus: ["🎯"],
					attack: true,
				},
				{
					name: "Yin or Yang",
					cost: 55,
					description: "Point Melanie or Alectrona upwards then unleashes its power which creates a massive blade of light OR darkness before slamming it down on to the enemy and strengthening its wielder. Deal 300% damage. Inflict Cursed, Bad Omen, and Weakness OR inflict Burn, Blindness, and Bleed. Gain Berserk OR gain Blessed and Empowerment",
					damage: 3,
					estatus: [["🖤", "🏴", "🌀"], ["🔥", "🩸", "👁️"]][Math.floor(Math.random() * 2)],
					pstatus: [["💢", "🏳️"], ["✨", "🍀", "🛡️"]][Math.floor(Math.random() * 2)],
					attack: true
				},
				{
					name: "Exalted Flash",
					cost: 35,
					description: "Unleash insanely fast identical strikes that strengthens the wielder. Deal 40% damage 4 times and gain Strength and Focus",
					damage: 0.4,
					times: 4,
					pstatus: ["🎯", "💪"],
					attack: true
				},
				{
					name: "Meditation",
					cost: 40,
					description: "User partially stabilizes the cursed and holy energy swirling within them from the two swords. Recovers 10% health and gain Regeneration and Strength",
					pstatus: ["💗", "💪"],
					health: 0.1,
					attack: false
				}
			]
		},
	],

	// Choose level from 6 to 12: Math.random() * (12 - 6) + 6
	armor: [
		{
			name: "Tattered Rags",
			description: "Torn clothing together enough to cover the most important part and keep warm.",
			armor: 27,
			plvlmult: 5,
			level: Math.random() * (10 - 1) + 1,
			alvlmult: 1,
			evasion: 0.06,
			encounter: 0.05
		},
		{
			name: "Damaged Cloak",
			description: "A brown cloak that seems to have been used extensively based on the heavily faded color and abundant tears",
			armor: 42,
			plvlmult: 5,
			level: Math.random() * (10 - 1) + 1,
			alvlmult: 2,
			evasion: 0.05,
			encounter: 0.05
		},
		{
			name: "Rogues Cloak",
			description: "A brown cloak that's still in good condition that should provide light protection due to it's a strong fabric",
			armor: 5,
			plvlmult: 5,
			level: Math.random() * (12 - 4) + 4,
			alvlmult: 2,
			evasion: 0.09,
			encounter: 0.05
		},
		{
			name: "Perfect Leaf",
			description: "A leaf with a vibrant hue of green, no missing leaves, damage, and a impressive shape that seems completely symmetrical it must be special.",
			armor: 47,
			plvlmult: 5,
			level: Math.random() * (12 - 4) + 4,
			alvlmult: 1,
			evasion: 0.13,
			encounter: 0.05
		},
		{
			name: "Padded Ckothing",
			description: "Multiple layers of normal clothing sown together to create a thick set shirt and pants , simple but surprisingly effective.",
			armor: 17,
			plvlmult: 5,
			level: Math.random() * (14 - 6) + 6,
			alvlmult: 2,
			evasion: 0.07,
			encounter: 0.05
		},
		{
			name: "Confidence",
			description: "Who needs armor or even clothing for that fact when you have such a magnificently strong body and mind? Clearly not you since you're just that impressive of an individual.",
			armor: 198,
			plvlmult: 5,
			level: Math.random() * (45 - 25) + 25,
			alvlmult: 10,
			evasion: 0.30,
			encounter: 0.05
		},
		{
			name: "Leather Armor",
			description: "A set of armor made from the tough hide of some kind of unlucky animal which provides good protect from a variety of attacks.",
			armor: 10,
			plvlmult: 5,
			level: Math.random() * (24 - 13) + 13,
			alvlmult: 4,
			evasion: 0.12,
			encounter: 0.05
		},
		{
			name: "Light Armor",
			description: "A set of leather armor that comes with a small set of metal coverings protecting most vital spots.",
			armor: 3,
			plvlmult: 5,
			level: Math.random() * (28 - 15) + 15,
			alvlmult: 7,
			evasion: 0.09,
			encounter: 0.05
		},
		{
			name: "Hunter Cloak",
			description: "A set of very light armor made from leather that provides decent protection without inhibiting mobility, topped of with a dark green cloak that conceals movement and provides even more protection.",
			armor: 70,
			plvlmult: 5,
			level: Math.random() * (32 - 19) + 19,
			alvlmult: 6,
			evasion: 0.25,
			encounter: 0.05
		},
		{
			name: "Assassin Cloak",
			description: "A black cloak made from a very light material with a set of padded clothing underneath.",
			armor: 25,
			plvlmult: 5,
			level: Math.random() * (32 - 19) + 19,
			alvlmult: 7,
			evasion: 0.10,
			encounter: 0.05
		},
		{
			name: "Lumberjack Atire",
			description: "A plaid long shirt and extra large black jeans a combo that just feels right for some unknown reason.",
			armor: 9,
			plvlmult: 5,
			level: Math.random() * (38 - 26) + 26,
			alvlmult: 14,
			evasion: 0.08,
			encounter: 0.05
		},
		{
			name: "Thick Sleevelss Hoodie",
			description: "A very large black hoodie that had it's sleeves cut off with a pair of baggy jeans.",
			armor: 105,
			plvlmult: 5,
			level: Math.random() * (40 - 25) + 25,
			alvlmult: 9,
			evasion: 0.20,
			encounter: 0.05
		},
		{
			name: "Leather Apron & Mask",
			description: "A stained apron made from leather and cloth facial covering that shields your nose and mouth.",
			armor: 270,
			plvlmult: 5,
			level: Math.random() * (50 - 26) + 26,
			alvlmult: 19,
			evasion: 0.14,
			encounter: 0.05
		},
		{
			name: "Iron Armor",
			description: "A full set of iron armor that protects your body from the neck down at the cost of mobility.",
			armor: 10,
			plvlmult: 5,
			level: Math.random() * (38 - 26) + 26,
			alvlmult: 15,
			evasion: 0.0,
			encounter: 0.05

		},
		{
			name: "Dragon Cloak",
			description: "A stylish jet-black cloak made from a extremely durable material rumored to actually be acquired by slaying a black dragon.",
			armor: 60,
			plvlmult: 5,
			level: Math.random() * (40 - 30) + 30,
			alvlmult: 12,
			evasion: 0.15,
			encounter: 0.05
		},
		{
			name: "Spiked Leather Armor",
			description: "Leather armor that's thin at the joints and extremely thick at vitals providing a mix of both maneuverability and protection. Having the mini spikes on it is mostly a bonus.",
			armor: 21,
			plvlmult: 5,
			level: Math.random() * (40 - 30) + 30,
			alvlmult: 17,
			evasion: 0.13,
			encounter: 0.05
		},
		{
			name: "Shinobi Garments",
			description: "The traditionally attire of those who practice ninjutsu consisting of a black jacket, black trousers, light sandals, and a hooded cowl.",
			armor: 244,
			plvlmult: 5,
			level: Math.random() * (50 - 30) + 30,
			alvlmult: 16,
			evasion: 0.15,
			encounter: 0.05
		},
		{
			name: "Holy Knights Armor",
			description: "A shiny suit of iron armor that's been blessed by the holy church and made from the finest iron",
			armor: 272,
			plvlmult: 5,
			level: Math.random() * (50 - 30) + 30,
			alvlmult: 24,
			evasion: 0.07,
			encounter: 0.05
		},
		{
			name: "Coat of Darkness",
			description: "WORK IN PROGRESS",
			armor: 244,
			plvlmult: 5,
			level: Math.random() * (50 - 30) + 30,
			alvlmult: 16,
			evasion: 0.15,
			encounter: 0.05
		},
		{
			name: "Blessed GI",
			description: "A martial artist GI that has been extensively blessed by the church till it's been imbued holy energy.",
			armor: 247,
			plvlmult: 5,
			level: Math.random() * (50 - 40) + 40,
			alvlmult: 28,
			evasion: 0.14,
			encounter: 0.05
		},
		{
			name: "Sinner Jacket",
			description: "WORK IN PROGRESS",
			armor: 261,
			plvlmult: 5,
			level: Math.random() * (50 - 40) + 40,
			alvlmult: 19,
			evasion: 0.23,
			encounter: 0.05
		},
		{
			name: "Walking Church",
			description: "A sacred treasure of the Holy Church, it's a priest robe bestowed with a blessing of protection of the highest grade that virtually makes the robe indestructible while protecting the wearer from most forms of damage.",
			armor: 250,
			plvlmult: 5,
			level: Math.random() * (50 - 45) + 45,
			alvlmult: 37,
			evasion: 0.0,
			encounter: 0.05
		},
		{
			name: "Black Mourning",
			description: "A black hooded cloak that's constantly secreting a black fog that's unnaturally cold to the touch. Instincts alone is enough to know this isn't a normal cloak...",
			armor: 47,
			plvlmult: 5,
			level: Math.random() * (50 - 45) + 45,
			alvlmult: 20,
			evasion: 0.25,
			encounter: 0.05
		},
		{
			name: "Equinox",
			description: "WORK IN PROGRESS",
			armor: 247,
			plvlmult: 5,
			level: Math.random() * (50 - 45) + 45,
			alvlmult: 24,
			evasion: 0.15,
			encounter: 0.05
		},
	]
}