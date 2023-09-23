const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const assets = require('./assets.js');
const inventory = require('./inventory.js');
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('encounter')
		.setDescription(`Data is now saved, so you can no longer select stuffs. If your data gets corrupted, sorry buddy.`)
		.addStringOption(option =>
			option.setName('area')
				.setDescription('The area to go to')
				.addChoices(
					{ name: '[1-5] Warhamshire', value: '0' },
					{ name: '[5-10] Warham Castle', value: '1' },
					{ name: '[8-14] Hinterland', value: '2' },
					{ name: '[12-18] Uralan Mountains', value: '3' },
					{ name: '[16-22] Vulpeston', value: '4' },
					{ name: '[21-29] Vulpes Tower', value: '5' },
					{ name: '[30-35] Vexadel', value: '6' },
					{ name: '[35-40] Vexadel Gaillard', value: '7' },
					{ name: '[40-45] Sanguisuge', value: '8' },
					{ name: '[45-50] Sangston Mansion', value: '9' },
					{ name: '[50+] Eternal Damnation', value: '10' },
				)
				.setRequired(true)
		),

	async execute(bot, interaction, db) {
		if (Number(interaction.options.getString('area')) == 10) return interaction.reply({ content: "Eternal Damnation isn't quite ready yet, so come back soon!", ephemeral: true })
		/*
			  0		     1				2			3	     4		 	5		    	6	    	  7	  	  8	 	 				 9											10										  11													12
			Level | Max Health | Current Health | Attack | Armor | Max Stamina | Current Stamina | Accuracy | XP | Weapon (itemIndex_itemAmount_itemLevel) | Armor Type (itemIndex_itemAmount_itemLevel) | Time since last played (milli) | Items (itemIndex_itemAmount_itemLevel-itemIndex_itemAmount_itemLevel-...)
		*/

		let player = (await db.get(`player_${interaction.user.id}`)).split('|')
		let rawWeapon = player[9].split('_')
		let rawArmor = player[10].split('_')
		let weapon = assets.items[Number(rawWeapon[0])]
		let armor = assets.items[Number(rawArmor[0])]
		let level = Number(player[0])
		let area = Number(interaction.options.getString('area'))
		let weaponlvl = Number(rawWeapon[1])
		let armorlvl = Number(rawArmor[1])

		var p = {
			name: interaction.member.nickname || interaction.member.displayName || interaction.user.username,
			level: level,

			maxHealth: Math.round(Number(player[1])),
			health: Math.round(Number(player[2])),

			maxStamina: Math.round(Number(player[5])),
			stamina: Math.round(Number(player[6])),

			baseAttack: Number(player[3]),
			baseArmor: Number(player[4]),

			attack: Math.round(Number(player[3]) + Number(6 * (level - 1)) + Number(weapon.attack) + Number(weaponlvl) + Number(level * Number(weapon.plvlmult))),
			armor: Math.round(Number(Number(player[4]) + Number(armor.armor) + Number(level * Number(armor.plvlmult)) + Number(Number(armorlvl) * Number(armor.alvlmult)))),

			accuracy: Number(player[7]),
			xp: Number(player[8]),
			critical: weapon.crit,
			evasion: armor.evasion,

			weapon: weapon,
			armorer: armor,
			inventory: player[12],

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

		var e;
		var choiceArea = assets.areas[area]
		var random = Math.random()
		var randomTrack = 0;

		if (p.level < choiceArea.minlvl - 1) return interaction.reply({ content: `Your level is too low! You must be at least level ${choiceArea.minlvl - 1} to travel to that area.`, ephemeral: true })
		for (let i = 0; i < choiceArea.enemies.length; i++) {
			randomTrack += choiceArea.enemies[i].chance;
			if (random <= randomTrack) {
				e = assets.enemies.find(({ name }) => name.toLowerCase().trim() == choiceArea.enemies[i].name.toLowerCase().trim())
				break;
			}
		}
		while (!e) e = assets.enemies.find(({ name }) => name.toLowerCase().trim() == choiceArea.enemies[Math.floor(Math.random() * choiceArea.enemies.length)].name.toLowerCase().trim())

		var elevel = Math.floor(Math.random() * (choiceArea.maxlvl - choiceArea.minlvl) + choiceArea.minlvl);
		var emaxHealth = Math.round(e.maxHealth + ((elevel / 2) ** 1.72424))
		var eattack = Math.round(e.attack + (elevel ** 1.62424))
		var eaccuracy = e.accuracy - p.evasion + (.0025 * (elevel - 1))
		var ecritical = e.critical + (.000125 * (elevel - 1))
		var exp = Math.round(((elevel ** 1.2) * (emaxHealth / eattack)) ** 1.2) * 2
		var ehealth = emaxHealth
		var edefense = e.maxdef ? Math.floor(Math.random() * (e.maxdef - e.mindef) + e.mindef) : 0

		if (eaccuracy > 1) eaccuracy = 1
		var pstatus = []
		var estatus = []
		var buttons = []
		var chatLog = [`⚔️ ${p.name} vs. ${e.name} ⚔️`]
		var eLog = []
		var timer = 750
		var ended = false
		var chestGotten = false
		var chest = -1

		const row = new ActionRowBuilder()
		const row2 = new ActionRowBuilder()
		var y = 0
		p.weapon.skills.forEach((sk) => {
			let skill = new ButtonBuilder()
			if (y == 0) {
				let attack = new ButtonBuilder()
					.setCustomId(sk.name)
					.setDisabled(true)
					.setLabel(sk.name)
					.setStyle(ButtonStyle.Danger)
					.setEmoji('⚔️');
				row2.addComponents(attack)
				buttons.push(attack)
				y++
				return;
			}

			skill.setCustomId(sk.name).setLabel(`${sk.name} - ${sk.cost}`)
			if (sk.health) skill.setStyle(ButtonStyle.Success)
			else if (sk.attack) skill.setStyle(ButtonStyle.Danger)
			else skill.setStyle(ButtonStyle.Primary)
			if (sk.estatus) skill.setEmoji(sk.estatus[Math.floor(Math.random() * sk.estatus.length)])
			else if (sk.pstatus) skill.setEmoji(sk.pstatus[Math.floor(Math.random() * sk.pstatus.length)])
			else if (sk.health) skill.setEmoji('💖')
			else skill.setEmoji('⚡')
			if (skill.cost ? skill.cost > p.stamina : true) skill.setDisabled(true)
			row.addComponents(skill)
			buttons.push(skill)
			y++
		})

		let pass = new ButtonBuilder()
			.setCustomId(`pass`)
			.setDisabled(true)
			.setLabel(`Pass`)
			.setStyle(ButtonStyle.Primary)
		row2.addComponents(pass)
		buttons.push(pass)
		let useitem = new ButtonBuilder()
			.setCustomId(`useitem`)
			.setDisabled(true)
			.setLabel(`Use Item`)
			.setStyle(ButtonStyle.Primary)
		row2.addComponents(useitem)
		buttons.push(useitem)


		interaction.reply(await embed(0x00ff00, null)).then(async (m) => {
			async function battle() {
				await disableButtons(false);
				var i = 0
				const collectorFilter = i => i.user.id === interaction.user.id;
				try {
					const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
					await disableButtons(true);
					if (confirmation.customId == 'pass') {
						p.stamina += Math.round(5 + ((p.level - 1) / 5)) > p.maxStamina ? p.maxStamina - p.stamina : Math.round(5 + ((p.level - 1) / 5))
						if (p.stamina > p.maxStamina) p.stamina = p.maxStamina
						chatLog.push(`${interaction.user.username} passed\nGained +${Math.round(5 + ((p.level - 1) / 5)) > p.maxStamina ? p.maxStamina - p.stamina : Math.round(5 + ((p.level - 1) / 5))}⚡`)
						await confirmation.update(await embed(0xff0000, null)).catch(async () => { m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) }) })
						setTimeout(async () => {
							contin(e)
						}, 500)
					} else if (confirmation.customId == 'useitem') {
						p.stamina += Math.round(5 + ((p.level - 1) / 5)) > p.maxStamina ? p.maxStamina - p.stamina : Math.round(5 + ((p.level - 1) / 5))
						if (p.stamina > p.maxStamina) p.stamina = p.maxStamina
						chatLog.push(`${interaction.user.username} passed\nUsing items during battles is not available yet.\nGained +${Math.round(5 + ((p.level - 1) / 5)) > p.maxStamina ? p.maxStamina - p.stamina : Math.round(5 + ((p.level - 1) / 5))}⚡`)
						await confirmation.update(await embed(0xff0000, null)).catch(async () => { m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) }) })
						setTimeout(async () => {
							contin(e)
						}, 500)
					} else {
						let skill = await p.weapon.skills.find(({ name }) => name == confirmation.customId)
						let hit = await hitMissCrit(p.accuracy, p.critical, pstatus)
						var logging = [`+ ${p.name} used ${skill.name}`]
						p.stamina -= skill.cost ? skill.cost : 0
						await playerSkill(hit, skill)

						if (skill.times && hit > 0) {
							chatLog.push(logging)
							logging[0] = `+ ${p.name} used ${skill.name} and hit ${e.name} for `
							m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
							for (i = 0; i < skill.times; i++) {
								setTimeout(async () => {
									let draft = p.attack + await debuffs(pstatus, p.attack, estatus, logging)
									let finalHit = Math.round(draft * (1 - edefense / 10) * hit * (skill.damage || 1))
									var chatIndex = chatLog.length - 1
									for (q = chatLog.length; q > -1; q--) { if (chatLog[q] ? String(chatLog[q]).startsWith(`- ${e.name} used ${skill.name}`) : false) chatIndex = q }
									if (hit == 1) logging.push(`⚔️${finalHit}`)
									else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
									else logging.push(`0`)
									ehealth = Math.round(ehealth - finalHit)

									logging = logging.filter((str) => str !== '')
									chatLog[chatIndex] = logging[0] + logging.slice(1).join(', ') + `${skill.estatus ? `\nInflicted: ${skill.estatus.join('')}` : ''}${skill.pstatus ? `\nGained: ${skill.pstatus.join('')}` : ''}`
									m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
									if (i < skill.times - 1) chatLog[chatIndex] = String(chatLog[chatIndex]).replace(/(?<=\n).*/g, '')
								}, 500 * i)
							}
						} else {
							if (skill.health) {
								let hit2 = hit
								if (hit2 == 0) hit2 = 1
								var healing = Math.round(p.maxHealth * skill.health * hit2)
								healing = (p.health + healing > p.maxHealth) ? p.maxHealth - p.health : healing
								if (hit2 == 1) logging.push(`healed for 💗${healing}`)
								else logging.push(`CRITICAL healed for 💗${healing}`)
								p.health += healing
							}

							if (skill.attack || skill.damage) {
								let draft = p.attack + await debuffs(pstatus, p.attack, estatus, false)
								let finalHit = Math.round(draft * (1 - edefense / 10) * hit * (skill.damage || 1))
								if (hit == 1) logging.push(`hit ${e.name} for ⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`hit ${e.name} for a CRITICAL ⚔️${finalHit}!`)
								else logging[0] = logging[0].replace('+ ', '') + ' and missed'
								ehealth -= finalHit
							} else {
								if (hit == 0 && !skill.health) logging[0] = logging[0].replace('+ ', '') + ' and failed'
							}

							(skill.pstatus || skill.estatus) && hit > 0 ? logging[logging.length - 1] = logging[logging.length - 1] + `${skill.estatus ? `\nInflicted: ${skill.estatus.join('')}` : ''}${skill.pstatus ? `\nGained: ${skill.pstatus.join('')}` : ''}` : false
							chatLog.push(logging.join(' and '))
							setTimeout(async () => {
								m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
							}, 500)
						}

						await confirmation.update(await embed(0xff0000, null)).catch(async () => { m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) }) })

						setTimeout(async () => {
							contin(e)
						}, timer * i)
					}

				} catch (error) { console.error(error) }
			}

			async function ebattle() {
				setTimeout(async () => {
					let hit = await hitMissCrit(eaccuracy, ecritical, estatus)
					let skill = await choose(hit)
					var logging = [`- ${e.name} used ${skill.name}`]
					var i = 1
					if (skill.times && hit > 0) {
						chatLog.push(logging)
						logging[0] = `- ${e.name} used ${skill.name} and hit ${p.name} for `
						m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
						for (i = 0; i < skill.times; i++) {
							setTimeout(async () => {
								let hit = await hitMissCrit(eaccuracy, ecritical, estatus)
								let draft = eattack + await debuffs(estatus, eattack, pstatus, logging)
								let finalHit = Math.round(draft * hit * (skill.damage || 1))
								finalHit -= Math.round(finalHit / (1.5 ** p.armor))
								var chatIndex = chatLog.length - 1

								for (q = chatLog.length; q > -1; q--) { if (chatLog[q] ? String(chatLog[q]).startsWith(`- ${e.name} used ${skill.name}`) : false) chatIndex = q }
								if (hit == 1) logging.push(`⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
								else logging.push(`0`)
								p.health -= finalHit

								logging = logging.filter((str) => str !== '')
								chatLog[chatIndex] = logging[0] + logging.slice(1).join(', ') + `${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}`
								m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
								if (i < skill.times - 1) chatLog[chatIndex] = String(chatLog[chatIndex]).replace(/(?<=\n).*/g, '')
							}, 500 * i)
						}
					} else {
						if (skill.health) {
							let hit2 = hit
							if (hit2 == 0) hit2 = 1
							var healing = Math.round(emaxHealth * skill.health * hit2)
							healing = (ehealth + healing > emaxHealth) ? emaxHealth - ehealth : healing
							if (hit2 == 1) logging.push(`healed for 💗${healing}`)
							else logging.push(`CRITICAL healed for 💗${healing}`)
							ehealth += healing
						}

						if (skill.attack || skill.damage) {
							let draft = eattack + await debuffs(estatus, eattack, pstatus, false)
							let finalHit = Math.round(draft * hit * (skill.damage || 1))
							finalHit -= Math.round(finalHit / (1.5 ** p.armor))
							p.armor >= finalHit / 1.5 ? finalHit -= Math.round(finalHit / 1.5) : finalHit -= p.armor
							if (hit == 1) logging.push(`hit ${p.name} for ⚔️${finalHit}`)
							else if (hit == 1.6) logging.push(`hit ${p.name} for a CRITICAL ⚔️${finalHit}!`)
							else logging[0] = logging[0].replace('- ', '') + ' and missed'
							p.health -= finalHit
						} else {
							if (hit == 0 && !skill.health) logging[0] = logging[0].replace('- ', '') + ' and failed'
						}

						(skill.pstatus || skill.estatus) && hit > 0 ? logging[logging.length - 1] = logging[logging.length - 1] + `${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}` : false
						chatLog.push(logging.join(' and '))
						setTimeout(async () => {
							m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
						}, 500)
					}

					setTimeout(async () => {
						await contin(p)
					}, timer * i++)
				}, 500)
			}

			async function choose(hitormiss) {
				// To choose an attack
				var random = Math.random()
				var skill;
				let randomTrack = 0;

				for (let i = 0; i < e.skills.length; i++) {
					randomTrack += e.skills[i].chance;
					if (random <= randomTrack && !(e.skills[i].wait ? eLog.slice(-e.skills[i].wait).includes(e.skills[i].name) : false)) {
						skill = e.skills[i];
						if (hitormiss > 0) {
							eLog.push(skill.wait ? skill.name : '-')
							let pbadomen = await pstatus.find(({ id }) => id == '🏴')
							let pblessed = await pstatus.find(({ id }) => id == '✨')
							let ebadomen = await estatus.find(({ id }) => id == '🏴')
							let eblessed = await estatus.find(({ id }) => id == '✨')

							if (skill.pstatus) {
								skill.pstatus.forEach(async (status) => {
									while (await pstatus.find(({ id }) => id == status)) pstatus.splice(pstatus.indexOf(status), 1)

									if (pblessed && !skill.pstatus.includes("🏴")) { if (!(await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200) }
									else if (pbadomen && !skill.pstatus.includes("✨")) { if ((await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200) }

									pstatus.push({
										id: status,
										length: await assets.statuses.find(stat => stat.id == status).length,
										damage: skill.damage ? p.attack * skill.damage : p.attack,
										positive: await assets.statuses.find(stat => stat.id == status).positive
									})
								})

								if (await pstatus.find(({ id }) => id == '🏴') && await pstatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${p.name}'s effects were cleansed and devastated ✨🏴`)
									pstatus.length = 0
								}
							}

							if (skill.estatus) {
								skill.estatus.forEach(async (status) => {
									while (await estatus.find(({ id }) => id == status)) estatus.splice(estatus.indexOf(status), 1)

									if (eblessed && !skill.estatus.includes("🏴")) { if (!(await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200) }
									else if (ebadomen && !skill.estatus.includes("✨")) { if ((await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200) }

									estatus.push({
										id: status,
										length: await assets.statuses.find(stat => stat.id == status).length,
										damage: skill.damage ? p.attack * skill.damage : p.attack,
										positive: await assets.statuses.find(stat => stat.id == status).positive
									})
								})

								if (await estatus.find(({ id }) => id == '🏴') && await estatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${p.name}'s effects were cleansed and devastated ✨🏴`)
									estatus.length = 0
								}
							}
						}
						m.edit(embed(0xff0000, null)).catch(error => { console.log(error) })
						break;
					}
				}

				return skill ? skill : e.skills[0];
			}

			async function playerSkill(hitormiss, skill) {
				if (hitormiss > 0) {
					let pbadomen = await pstatus.find(({ id }) => id == '🏴')
					let pblessed = await pstatus.find(({ id }) => id == '✨')
					let ebadomen = await estatus.find(({ id }) => id == '🏴')
					let eblessed = await estatus.find(({ id }) => id == '✨')

					if (skill.pstatus) {
						skill.pstatus.forEach(async (status) => {
							while (await pstatus.find(({ id }) => id == status)) pstatus.splice(pstatus.indexOf(status), 1)

							if (pblessed && !skill.pstatus.includes("🏴")) { if (!(await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200) }
							else if (pbadomen && !skill.pstatus.includes("✨")) { if ((await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200) }

							pstatus.push({
								id: status,
								length: await assets.statuses.find(stat => stat.id == status).length,
								damage: skill.damage ? p.attack * skill.damage : p.attack,
								positive: await assets.statuses.find(stat => stat.id == status).positive
							})
						})

						if (await pstatus.find(({ id }) => id == '🏴') && await pstatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${p.name}'s effects were cleansed and erradicated ✨🏴`)
							pstatus.length = 0
						}
					}

					if (skill.estatus) {
						skill.estatus.forEach(async (status) => {
							while (await estatus.find(({ id }) => id == status)) estatus.splice(estatus.indexOf(status), 1)

							if (eblessed && !skill.estatus.includes("🏴")) { if (!(await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200) }
							else if (ebadomen && !skill.estatus.includes("✨")) { if ((await assets.statuses.find(stat => stat.id == status).positive)) return setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200) }

							estatus.push({
								id: status,
								length: await assets.statuses.find(stat => stat.id == status).length,
								damage: skill.damage ? p.attack * skill.damage : p.attack,
								positive: await assets.statuses.find(stat => stat.id == status).positive
							})
						})

						if (await estatus.find(({ id }) => id == '🏴') && await estatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${p.name}'s effects were cleansed and erradicated ✨🏴`)
							estatus.length = 0
						}
					}
				}
				m.edit(embed(0xff0000, null)).catch(error => { console.log(error) })
				return true;
			}

			async function disableButtons(boolean) {
				buttons.forEach(async (bt) => {
					let skill = await p.weapon.skills.find(({ name }) => name == bt.data.custom_id)
					if (ended) {
						bt.setDisabled(true).setStyle(ButtonStyle.Secondary)
					} else {
						if (skill) {
							if (!boolean && (skill.cost ? skill.cost <= p.stamina : true)) {
								bt.setDisabled(false)
							} else if (boolean) {
								bt.setDisabled(true)
							}
						} else bt.setDisabled(boolean)
					}
				})
				return await m.edit(await embed(ended ? 0x2B2D31 : 0x00ff00)).catch(error => { console.log(error) })
			}

			async function contin(turn) {
				if (ended) return;
				if (p.health <= 0 || ehealth <= 0) {
					ended = true
					player[11] = Date.now()
					if (p.health <= 0 && ehealth <= 0) {
						chatLog.push(`❔ An error has occurred and resulted in a tie ❔`)
						await db.set(`player_${interaction.user.id}`, player.join('|'))
					} else if (p.health <= 0) {
						chatLog.push(`🌀 ${p.name} lost the battle 🌀`)
						await db.set(`player_${interaction.user.id}`, player.join('|'))
					} else {
						chatLog.push(`🎉 ${p.name} won the battle! 🎉\n${p.name} gained 🪷${exp}!`)
						if (e.drops) {
							async function drop() {
								var item = undefined;
								var randomTrack = 0;
								for (let i = 0; i < e.drops.length; i++) {
									randomTrack += e.drops[i].chance;
									if (random <= randomTrack) {
										item = e.drops[i]
										break;
									}
								}
								if (item) return item;
								else return await drop();
							}

							var item;
							while (!item) {
								item = await drop()
								if (item ? item.name : false) item = assets.items.find(({ name }) => name == item.name)
							}

							if (item.name) {
								var itemlvl = 0
								item = assets.items.find(({ name }) => name == item.name)

								if (item) {
									db.set(`player_${interaction.user.id}`, inventory.player.add(interaction.user.id, item.name, (item.maxlvl ? Math.floor(Math.random() * (item.maxlvl - item.minlvl) - item.minlvl) : item.minlvl || 0)))
									chatLog.push(`${e.name} dropped ${item.name.match(/\A[^aeiouAEIOU]/) && !(item.attack || item.armor) ? 'an' : 'a'} ${(item.attack || item.armor) && itemlvl > 0 ? `Level ${itemlvl} ` : ''}${item.name}!`)
								} else {
									chatLog.push(`Something went wrong trying to collect an item.`)
								}
							}
						}

						p.xp += exp
						while (p.xp >= Math.round((p.level / 0.07) ** 2)) {
							p.xp -= Math.round((p.level / 0.07) ** 2)
							p.level += 1
							p.maxHealth = Math.round(Number(player[1]) + (50 * (p.level - 1)))
							p.health = p.maxHealth
							p.maxStamina = Math.round(Number(player[5]) + (5 * (p.level - 1)))
							p.stamina = p.maxStamina
							p.baseAttack = Math.round(Number(player[3]) + (6 * (p.level - 1)))
							p.baseArmor = Math.round(Number(player[4]) + (10 * (p.level - 1)))
							chatLog.push(`⬆️ ${p.name} leveled up to level ${p.level}! ⬆️`)
						}

						await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${p.inventory ? `|${p.inventory}` : ''}`)
						m.edit(await embed(0x2B2D31, null)).catch(error => { console.log(error) })

						const collectorFilter = i => i.user.id === interaction.user.id;
						const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
						if (confirmation.customId == "log") {
							await fs.writeFileSync('../logs.txt', `Starting Health:\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Recieved: ${p.maxHealth - p.health}\nEnemy Damage Received: ${emaxHealth - ehealth}\n---\n\n${chatLog.join('\n\n')}\n\n---\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
							let file = await new AttachmentBuilder('../logs.txt');
							confirmation.update(await embed(0x2B2D31, file)).catch(async () => { m.edit(await embed(0x2B2D31, file)).catch(error => { console.log(error) }) })
						} else if (confirmation.customId == "chest") {
							let chestChoice = assets.chests[chest]
							let keyRequired = assets.items.find(({ name }) => name == chestChoice.key)
							let row4 = new ActionRowBuilder()
								.addComponents(new ButtonBuilder()
									.setCustomId(`open`)
									.setLabel(`Crack it Open!`)
									.setStyle(ButtonStyle.Success))
								.addComponents(new ButtonBuilder()
									.setCustomId(`nothx`)
									.setLabel(`No Thanks`)
									.setStyle(ButtonStyle.Danger))

							confirmation.update({
								embeds: [
									{
										title: chestChoice.name,
										thumbnail: keyRequired,
										description: `You've found ${chestChoice.name.match(/\A[^aeiouAEIOU]/) ? 'an' : 'a'} ${chestChoice.name}! If you have its corresponding key, you can unlock it!`,
										image: {
											url: chestChoice.sprite
										},
										footer: {
											text: `Note: The key required is the ${keyRequired.name}.`
										}
									}
								],
								components: [row4]
							}).catch(() => { return })

							const chestComf = await m.awaitMessageComponent({ filter: collectorFilter });
							chestGotten = true
							if (chestComf.customId == 'open') {
								if (await inventory.player.search(interaction.user.id, chestChoice.key)) {
									async function drop() {
										var item = undefined;
										var randomTrack = 0;
										for (let i = 0; i < chestChoice.drops.length; i++) {
											randomTrack += chestChoice.drops[i].chance;
											if (random <= randomTrack) {
												item = chestChoice.drops[i]
												break;
											}
										}
										if (item) return item;
										else return await drop();
									}

									var item2;
									var droplvl = undefined
									while (!item2 || !item2.name) {
										item2 = await drop()
										if (item2) item2 = assets.items.find(({ name }) => name == item2.name)
										if (item2) droplvl = (item2.maxlvl ? Math.floor(Math.random() * (item2.maxlvl - item2.minlvl) - item2.minlvl) : item2.minlvl) || 0
									}

									db.set(`player_${interaction.user.id}`, await inventory.player.add(interaction.user.id, item2.name, droplvl))
									db.set(`player_${interaction.user.id}`, await inventory.player.remove(interaction.user.id, chestChoice.key))
									chatLog.push(`${p.name} opened the ${chestChoice.name}\nCollected: ${droplvl > 0 ? `Level ${droplvl} ` : ''}${item2.name}`)
									chestComf.update({
										embeds: [
											{
												title: `${chestChoice.name} Opened!`,
												description: `The chest has been opened and you have collected...`,
												fields: [
													{
														name: `${item2.emoji ? `${item2.emoji} ` : ''}**${item2.name}**`,
														value: (`${droplvl > 0 ? `Level ${droplvl}\n` : ''}${item2.attack ? 'Weapon' : (item2.armor ? 'Armor' : '')}${item2.name.includes('Potion') ? 'Consumable' : ''}${item2.chest ? 'Chest Key' : ''}${(item2.battle ? '\nBattle Item' : (!item2.name.includes('Potion') && !item2.attack && !item2.armor && !item2.chest ? 'Reagent' : ''))}`).trim()
													}
												],
												footer: {
													text: `Changing back to battle view...`
												}
											}
										],
										components: []
									}).catch(error => { console.log(error) })

									setTimeout(async () => {
										m.edit(await embed(0x2B2D31, null)).catch(error => { console.log(error) })
										const collectorFilter = i => i.user.id === interaction.user.id;
										const confirmation = await m.awaitMessageComponent({ filter: collectorFilter }).catch(error => { console.log(error) })
										if (confirmation.customId == "log") {
											await fs.writeFileSync('../logs.txt', `Starting Health:\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Recieved: ${p.maxHealth - p.health}\nEnemy Damage Received: ${emaxHealth - ehealth}\n---\n\n${chatLog.join('\n\n')}\n\n---\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
											let file = await new AttachmentBuilder('../logs.txt');
											confirmation.update(await embed(0x2B2D31, file)).catch(error => { console.log(error) })
										}
									}, 10000)
								} else {
									chestComf.update({
										embeds: [
											{
												title: `Uh oh...`,
												description: `Sorry, but you don't own the key required to unlock the chest.`,
												footer: {
													text: `Changing back to battle view...`
												}
											}
										],
										components: []
									})

									setTimeout(async () => {
										m.edit(await embed(0x2B2D31, null)).catch(error => { console.log(error) })

										const collectorFilter = i => i.user.id === interaction.user.id;
										const confirmation = await m.awaitMessageComponent({ filter: collectorFilter }).catch(error => { console.log(error) })
										if (confirmation.customId == "log") {
											await fs.writeFileSync('../logs.txt', `Starting Health:\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Recieved: ${p.maxHealth - p.health}\nEnemy Damage Received: ${emaxHealth - ehealth}\n---\n\n${chatLog.join('\n\n')}\n\n---\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
											let file = await new AttachmentBuilder('../logs.txt');
											confirmation.update(await embed(0x2B2D31, file)).catch(error => { console.log(error) })
										}
									}, 5000)
								}

							} else {
								chestComf.update(await embed(0x2B2D31, null)).catch(error => { console.log(error) })

								const collectorFilter = i => i.user.id === interaction.user.id;
								const confirmatio = await m.awaitMessageComponent({ filter: collectorFilter }).catch(error => { console.log(error) });
								if (confirmatio.customId == "log") {
									await fs.writeFileSync('../logs.txt', `Starting Health:\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Recieved: ${p.maxHealth - p.health}\nEnemy Damage Received: ${emaxHealth - ehealth}\n---\n\n${chatLog.join('\n\n')}\n\n---\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
									let file = await new AttachmentBuilder('../logs.txt');
									confirmatio.update(await embed(0x2B2D31, file)).catch(error => { console.log(error) })
								}
							}
						}
						return;
					}

					const collectorFilter = i => i.user.id === interaction.user.id;
					const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
					if (confirmation.customId == "log") {
						await fs.writeFileSync('../logs.txt', `Starting Health:\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Recieved: ${p.maxHealth - p.health}\nEnemy Damage Received: ${emaxHealth - ehealth}\n---\n\n${chatLog.join('\n\n')}\n\n---\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
						let file = await new AttachmentBuilder('../logs.txt');
						confirmation.update(await embed(0x2B2D31, file)).catch(async () => { m.edit(await embed(0x2B2D31, file)).catch(error => { console.log(error) }) })
					}

					return;
				}

				[estatus, pstatus].forEach(async stat => {
					let badomen = await stat.find(({ id }) => id == '🏴')
					let blessed = await stat.find(({ id }) => id == '✨')

					if (badomen && blessed) {
						chatLog.push(`${stat == pstatus ? p.name : e.name}'s effects were cleansed and devastated ✨🏴`)
						if (stat == pstatus) pstatus.length = 0
						else estatus.length = 0
						setTimeout(async () => { m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) }) }, 500)
					} else if (badomen && !blessed) {
						let removal = stat == pstatus ? pstatus.filter(eff => eff.positive === true) : estatus.filter(eff => eff.positive === true)
						let lasting = stat == pstatus ? pstatus.filter(eff => eff.positive === false) : estatus.filter(eff => eff.positive === false)
						if (removal.length > 0) chatLog.push(`${stat == pstatus ? p.name : e.name}'s effects (${await statusList(removal)}) were devastated 🏴`)
						stat == pstatus ? pstatus = lasting : estatus = lasting
						setTimeout(async () => { m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) }) }, 500)
					} else if (!badomen && blessed) {
						let removal = stat == pstatus ? pstatus.filter(eff => eff.positive === false) : estatus.filter(eff => eff.positive === false)
						let lasting = stat == pstatus ? pstatus.filter(eff => eff.positive === true) : estatus.filter(eff => eff.positive === true)
						if (removal.length > 0) chatLog.push(`${stat == pstatus ? p.name : e.name}'s effects (${await statusList(removal)}) were cleansed ✨`)
						stat == pstatus ? pstatus = lasting : estatus = lasting
					}
				})

				let xstatus = turn == p ? pstatus : estatus
				let xhealth = turn == p ? p.health : ehealth
				var stunned = false
				var i = 1

				xstatus.forEach(async status => {
					if (p.health > 0 && ehealth > 0) {
						setTimeout(async () => {
							try {
								let end = await (assets.statuses.find(stat => stat.id === status.id)).use(turn, xstatus, xhealth, chatLog, turn.name, emaxHealth)
								turn == p ? pstatus = end.statuses : estatus = end.statuses
								turn == p ? p.health = end.currentHealth : ehealth = end.currentHealth
								chatLog = end.chatLog
								m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
							} catch {
								i--
								return;
							}
						}, (timer / 2) * i++)
					}
				})

				if (p.health > 0 && ehealth > 0) {
					setTimeout(async () => {
						if (await xstatus.find(({ id }) => id == '💫')) {
							stunned = true
							chatLog.push(`${turn.name} is stunned`)
							xstatus == pstatus ? pstatus.splice(pstatus.indexOf(pstatus.find(({ id }) => id == '💫')), 1) : estatus.splice(estatus.indexOf(estatus.find(({ id }) => id == '💫')), 1)
							m.edit(await embed(0xff0000, null)).catch(error => { console.log(error) })
						}

						if (p.health > 0 && ehealth > 0) {
							if (p.health > p.maxHealth) p.health = p.maxHealth
							if (ehealth > emaxHealth) ehealth = emaxHealth
							if (turn == p) { if (stunned) { contin(e); } else { battle(); await disableButtons(false); } }
							else stunned ? contin(p) : ebattle()
						} else contin(turn)
					}, (timer / 2) * i++)
				} else contin(turn)
			}

			contin(p)
		})

		async function embed(color, file) {
			let estatusList = await statusList(estatus)
			let pstatusList = await statusList(pstatus)
			var embed = {
				embeds: [
					{
						color: color,
						author: {
							name: `${e.name}`,
						},
						thumbnail: {
							url: e.sprite
						},
						fields: [
							{
								name: `${ehealth == emaxHealth ? '💖' : (ehealth < emaxHealth / 2 && ehealth > 0 ? (p.weapon.name == "Wooden Bow" ? '💘' : '❤️‍🩹') : (ehealth <= 0 ? '💔' : (p.weapon.name == "Wooden Bow" ? '💘' : '❤️')))} ${ehealth}/${emaxHealth}${estatusList.includes("🩸") || estatusList.includes("🔥") || estatusList.includes("💀") || estatusList.includes("💗") || estatusList.includes("🖤") ? '*' : ''}`,
								value: `Level ${elevel}\n${estatusList || ''}`,
								inline: true
							},
							{
								name: `⚔️ ${eattack}${estatusList.includes("💪") || estatusList.includes("🏳️") || estatusList.includes("💢") || estatusList.includes("🌀") || pstatusList.includes("🛡️") ? '*' : ''}`,
								value: `- ${e.weapon || "None"}`,
								inline: true
							},
							{
								name: `🛡️ ${edefense * 10}%${estatusList.includes("🛡️") ? '*' : ''}`,
								value: 'Defense',
								inline: true
							},
							{
								name: `Combat Log`,
								value: `\`\`\`diff\n${chatLog.slice(-(5 + Math.round(elevel / 10))).join('\n')}\n\`\`\``,
								inline: false
							},
							{
								name: `${p.health == p.maxHealth ? '💖' : (p.health < p.maxHealth / 2 ? '❤️‍🩹' : '❤️')} ${p.health}/${p.maxHealth}${pstatusList.includes("🩸") || pstatusList.includes("🔥") || pstatusList.includes("💀") || pstatusList.includes("💗") || pstatusList.includes("🖤") ? '*' : ''}`,
								value: `Level ${p.level}\n${pstatusList || ''}`,
								inline: true
							},
							{
								name: `⚔️ ${p.attack}${pstatusList.includes("💪") || pstatusList.includes("🏳️") || pstatusList.includes("💢") || pstatusList.includes("🌀") || estatusList.includes("🛡️") ? '*' : ''}`,
								value: `- ${p.synergized ? '__' : ''}${p.weapon.name}${p.synergized ? '__' : ''}\n- ${p.synergized ? '__' : ''}${p.armorer.name}${p.synergized ? '__' : ''}`,
								inline: true
							},
							{
								name: `⚡ ${p.stamina}/${p.maxStamina}`,
								value: 'Stamina',
								inline: true
							},
						],
						footer: {
							text: `${p.name}\n🪷 ${p.xp}/${Math.round((p.level / 0.07) ** 2)} | 💥 ${String(p.critical * 100).slice(0, 4)}%${pstatusList.includes("🍀") || pstatusList.includes("🐈‍⬛") ? '*' : ''} | 🎯 ${String(p.accuracy * 100).slice(0, 4)}%${pstatusList.includes("👁️") || pstatusList.includes("🎯") || pstatusList.includes("💢") || estatusList.includes("💨") ? '*' : ''} | 💨 ${String(p.evasion * 100).slice(0, 4)}%${pstatusList.includes("💨") ? '*' : ''} | 🪖 ${p.armor}${pstatusList.includes("🛡️") ? '*' : ''}`,
							icon_url: interaction.user.avatarURL()
						}
					}
				],
				components: [row2, row]
			}

			if (ended) {
				var row3 = new ActionRowBuilder()
				row3.addComponents(new ButtonBuilder()
					.setCustomId(`log`)
					.setLabel(`View Battle Logs`)
					.setStyle(ButtonStyle.Secondary))
				file ? embed = { content: `${p.name.toUpperCase()} ⚔️ ${e.name.toUpperCase()}`, embeds: [] } : embed.embeds[0].fields = [
					{
						name: `Combat Log`,
						value: `\`\`\`diff\n${chatLog.slice(-(5 + Math.round(elevel / 10))).join('\n')}\n\`\`\``,
						inline: false
					},
					{
						name: `${p.health == p.maxHealth ? '💖' : (p.health < p.maxHealth / 2 && p.health > 0 ? '❤️‍🩹' : (p.health > 0 ? '❤️' : '💔'))} ${p.health}/${p.maxHealth}`,
						value: `⚡ ${p.stamina}/${p.maxStamina}\n${p.name}\nLevel ${p.level}`,
						inline: true
					},
					{
						name: `${ehealth == emaxHealth ? '💖' : (ehealth < emaxHealth / 2 && ehealth > 0 ? (p.weapon.name == "Wooden Bow" ? '💘' : '❤️‍🩹') : (ehealth <= 0 ? '💔' : (p.weapon.name == "Wooden Bow" ? '💘' : '❤️')))} ${ehealth}/${emaxHealth}`,
						value: `${e.name}\nLevel ${elevel}`,
						inline: true
					},
				]


				if (!chestGotten && p.health > 0) {
					var counter = 0
					var randNum = Math.random()
					var addedButton = false
					choiceArea.chests.forEach(async chestc => {
						if (chest < 0) {
							counter += chestc.chance
							if (randNum <= counter) {
								chest = chestc.chest
								row3.addComponents(new ButtonBuilder()
									.setCustomId(`chest`)
									.setLabel(`Chest?`)
									.setStyle(ButtonStyle.Success))
								addedButton = true
							} else if (chestc.keyChance) {
								counter += chestc.keyChance
								if (randNum < counter) {
									const item = assets.items.find(({ name }) => name == chestc.key)
									if (p.inventory) {
										var inv = await p.inventory.split('-')
										var updated = false;
										for (a = 0; a < inv.length; a++) {
											let iter = inv[a].split('_')
											if (Number(iter[0]) == assets.items.indexOf(item)) {
												iter[1] = Number(iter[1]) + 1
												inv[a] = iter.join('_')
												updated = true;
												break;
											}
										}

										if (!updated) inv.push(`${assets.items.indexOf(item)}_1_0`)
										p.inventory = inv.join('-')
									} else p.inventory = `${assets.items.indexOf(item)}_1_0`
									await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}|${Date.now()}${p.inventory ? `|${p.inventory}` : ''}`)
									chatLog.push(`${p.name} found ${item.name.match(/\A[^aeiouAEIOU]/) && !(item.attack || item.armor) ? 'an' : 'a'} ${item.name}`)
								}
							}
							return;
						} else {
							if (!addedButton) {
								row3.addComponents(new ButtonBuilder()
									.setCustomId(`chest`)
									.setLabel(`Chest?`)
									.setStyle(ButtonStyle.Success))
								addedButton = true
							}
						}
					})
				}

				file ? false : embed.embeds[0].color = 0x000000
				file ? false : embed.embeds[0].footer.text = `${p.name}\n🪷 ${p.xp}/${Math.round((p.level / 0.07) ** 2)}`
				embed.components = file ? [] : [row3]
				embed.files = file ? [file] : []
			}

			return embed;
		}

		async function hitMissCrit(hitChance, critChance, statuses) {
			var hit = hitChance
			var crit = critChance

			statuses.forEach((stat) => {
				if (stat.id == '🎯') {
					stat.length -= 1
					hit += 0.5
					if (stat.length == 0) statuses.splice(statuses.indexOf(stat), 1)
				} else if (stat.id == '🍀') {
					stat.length -= 1
					crit += 0.25
					if (stat.length == 0) statuses.splice(statuses.indexOf(stat), 1)
				} else if (stat.id == '👁️') {
					stat.length -= 1
					hit -= 0.20
					if (stat.length == 0) statuses.splice(statuses.indexOf(stat), 1)
				} else if (stat.id == '💨') {
					stat.length -= 1
					hit -= 0.15
					if (stat.length == 0) statuses.splice(statuses.indexOf(stat), 1)
				} else if (stat.id == '🐈‍⬛') {
					stat.length -= 1
					crit -= 0.20
					if (stat.length == 0) statuses.splice(statuses.indexOf(stat), 1)
				}
			})

			if (hit > 1) hit = 1
			if (hit < 0) hit = 0
			if (crit > 1) crit = 1
			if (crit < 0) crit = 0

			if (Math.random() < hit) {
				if (Math.random() < crit) {
					return 1.6
				} else return 1
			} else return 0
		}

		async function statusList(EorP) {
			var array = [];
			EorP.forEach((status) => {
				array.push(status.id.replace(/[a-zA-Z ]+/g, ''))
			})
			return `${array[0] ? `\`${array.join('')}\`` : ''}`;
		}

		async function debuffs(EorP, currentAttack, EorP2, logging) {
			var final = 0
			EorP.forEach(async status => {
				if (status.id == '💢') {
					final += (currentAttack * 0.4)
					if (logging ? logging.length == 1 : true) { status.length -= 1 }
					if (status.length == 0) EorP.splice(EorP.indexOf(status), 1)
				} else if (status.id == '💪') {
					final += (currentAttack * 0.15)
					if (logging ? logging.length == 1 : true) { status.length -= 1 }
					if (status.length == 0) EorP.splice(EorP.indexOf(status), 1)
				} else if (status.id == '🏳️') {
					final += (currentAttack * 0.4)
					if (logging ? logging.length == 1 : true) { status.length -= 1 }
					if (status.length == 0) EorP.splice(EorP.indexOf(status), 1)
				} else if (status.id == '🌀') {
					final -= (currentAttack * 0.25)
					if (logging ? logging.length == 1 : true) { status.length -= 1 }
					if (status.length == 0) EorP.splice(EorP.indexOf(status), 1)
				}
			})

			EorP2.forEach(async status => {
				if (status.id == '🛡️') {
					final -= currentAttack * 0.20
					if (logging ? logging.length == 1 : true) { status.length -= 1 }
					if (status.length == 0) EorP2.splice(EorP2.indexOf(status), 1)
				} else if (status.id == '💢') {
					final += currentAttack * 0.3
				}
			})
			return final;
		}
	}
}