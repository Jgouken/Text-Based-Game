const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const assets = require('./assets.js');
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
		if (Number(interaction.options.getString('area') == 10)) return interaction.reply({ content: "Eternal Damnation isn't quite ready yet, so come back soon!", ephemeral: true })

		if (!(await db.get(`player_${interaction.user.id}`))) {
			await db.set(`player_${interaction.user.id}`, `1|500|500|30|10|50|50|0.95|0|0_1_0|31_1_0`)
		}

		/*
			  0		     1				2			3	     4		 	5		    	6	    	  7	  	  8	 	  9			10				  11
			Level | Max Health | Current Health | Attack | Armor | Max Stamina | Current Stamina | Accuracy | XP | Weapon (itemIndex_itemAmount_itemLevel) | Armor Type (itemIndex_itemAmount_itemLevel) | Items (itemIndex_itemAmount_itemLevel-itemIndex_itemAmount_itemLevel-...)
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
			inventory: player[11],

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
		var exp = Math.round((p.level * (emaxHealth / eattack)) ** 1.2) * 2
		var ehealth = emaxHealth
		var edefense = e.maxdef ? Math.floor(Math.random() * (e.maxdef - e.mindef) + e.mindef) : 0

		if (eaccuracy > 1) eaccuracy = 1
		var pstatus = []
		var estatus = []
		var buttons = []
		var chatLog = [`⚔️ ${p.name} vs. ${e.name} ⚔️`]
		var eLog = []
		let timer = 750
		var ended = false

		const row = new ActionRowBuilder()
		var y = 0
		p.weapon.skills.forEach((sk) => {
			let skill = new ButtonBuilder()
			if (y == 0) {
				let attack = new ButtonBuilder()
					.setCustomId(sk.name)
					.setLabel(sk.name)
					.setStyle(ButtonStyle.Danger)
					.setEmoji('⚔️');
				row.addComponents(attack)
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
			else skill.setEmoji('⚔️')
			if (skill.cost ? skill.cost > p.stamina : true) skill.setDisabled(true)
			row.addComponents(skill)
			buttons.push(skill)
			y++
		})

		interaction.reply(await embed(0x00ff00, null)).then(async (m) => {
			async function battle() {
				await disableButtons(false);
				var i = 0
				const collectorFilter = i => i.user.id === interaction.user.id;
				try {
					const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
					let skill = await p.weapon.skills.find(({ name }) => name == confirmation.customId)
					let hit = await hitMissCrit(p.accuracy, p.critical, pstatus)
					var logging = [`+ ${p.name} used ${skill.name}`]
					p.stamina -= skill.cost ? skill.cost : 0
					await playerSkill(hit, skill)

					if (skill.times && hit > 0) {
						chatLog.push(logging)
						logging[0] = `+ ${p.name} used ${skill.name} and hit ${e.name} for `
						m.edit(await embed(0xff0000, null)).catch(() => { return })
						for (i = 0; i < skill.times; i++) {
							setTimeout(async () => {
								let draft = p.attack + await debuffs(pstatus, p.attack, estatus, logging)
								let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * (1 - edefense / 10) * hit * (skill.damage || 1))
								var chatIndex = chatLog.length - 1
								for (q = chatLog.length; q > -1; q--) { if (chatLog[q] ? String(chatLog[q]).startsWith(`- ${e.name} used ${skill.name}`) : false) chatIndex = q }
								if (hit == 1) logging.push(`⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
								else logging.push(`0`)
								ehealth = Math.round(ehealth - finalHit)

								logging = logging.filter((str) => str !== '')
								chatLog[chatIndex] = logging[0] + logging.slice(1).join(', ') + `${skill.estatus ? `\nInflicted: ${skill.estatus.join('')}` : ''}${skill.pstatus ? `\nGained: ${skill.pstatus.join('')}` : ''}`
								m.edit(await embed(0xff0000, null)).catch(() => { return })
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
							let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * (1 - edefense / 10) * hit * (skill.damage || 1))
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
							m.edit(await embed(0xff0000, null)).catch(() => { return })
						}, 500)
					}
					await disableButtons(true)
					await confirmation.update(await embed(0xff0000, null)).catch(async () => { m.edit(await embed(0xff0000, null)).catch(() => { return }) })

					setTimeout(async () => {
						contin(e)
					}, timer * i)
				}
				catch (error) { console.error(error) }
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
						m.edit(await embed(0xff0000, null)).catch(() => { return })
						for (i = 0; i < skill.times; i++) {
							setTimeout(async () => {
								let hit = await hitMissCrit(eaccuracy, ecritical, estatus)
								let draft = eattack + await debuffs(estatus, eattack, pstatus, logging)
								let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * hit * (skill.damage || 1))
								finalHit -= Math.round(finalHit / (1.5 ** p.armor))
								var chatIndex = chatLog.length - 1

								for (q = chatLog.length; q > -1; q--) { if (chatLog[q] ? String(chatLog[q]).startsWith(`- ${e.name} used ${skill.name}`) : false) chatIndex = q }
								if (hit == 1) logging.push(`⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
								else logging.push(`0`)
								p.health -= finalHit

								logging = logging.filter((str) => str !== '')
								chatLog[chatIndex] = logging[0] + logging.slice(1).join(', ') + `${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}`
								m.edit(await embed(0xff0000, null)).catch(() => { return })
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
							let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * hit * (skill.damage || 1))
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
							m.edit(await embed(0xff0000, null)).catch(() => { return })
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
						m.edit(embed(0xff0000, null)).catch(() => { return })
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
				m.edit(embed(0xff0000, null)).catch(() => { return })
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
				return await m.edit(await embed(ended ? 0x000000 : 0x00ff00)).catch(() => { return });
			}

			async function contin(turn) {
				if (ended) return;
				if (p.health <= 0 || ehealth <= 0) {
					ended = true
					if (p.health <= 0 && ehealth <= 0) {
						chatLog.push(`❔ An error has occurred and resulted in a tie ❔`)
					} else if (p.health <= 0) {
						chatLog.push(`🌀 ${p.name} lost the battle 🌀`)
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
									if (item.attack || item.armor) itemlvl = (item.maxlvl ? Math.floor(Math.random() * (item.maxlvl - item.minlvl) - item.minlvl) : item.minlvl) || 0

									if (p.inventory) {
										var inv = await p.inventory.split('-')
										var updated = false;
										for (a = 0; a < inv.length; a++) {
											let iter = inv[a].split('_')
											if (Number(iter[0]) == assets.items.indexOf(item) && Number(iter[2]) == itemlvl) {
												iter[1] = Number(iter[1]) + 1
												inv[a] = iter.join('_')
												updated = true;
												break;
											}
										}

										if (!updated) inv.push(`${assets.items.indexOf(item)}_1_${itemlvl}`)
										p.inventory = inv.join('-')
									} else p.inventory = `${assets.items.indexOf(item)}_1_${itemlvl}`

									chatLog.push(`${p.name} collected ${item.name.match(/\A[^aeiouAEIOU]/) && !(item.attack || item.armor) ? 'an' : 'a'} ${(item.attack || item.armor) && itemlvl > 0 ? `Level ${itemlvl} ` : ''}${item.name}!`)
								} else {
									chatLog.push(`Something went wrong trying to collect an item.`)
								}
							}
						}

						while (exp > 0) {
							if (exp >= (Math.round((p.level / 0.07) ** 2) - p.xp)) {
								p.level += 1
								chatLog.push(`⬆️ ${p.name} leveled up to level ${p.level}! ⬆️`)
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

						await db.set(`player_${interaction.user.id}`, `${p.level}|${p.maxHealth}|${p.health}|${p.baseAttack}|${p.baseArmor}|${p.maxStamina}|${p.stamina}|${p.accuracy}|${p.xp}|${rawWeapon.join('_')}|${rawArmor.join('_')}${p.inventory ? `|${p.inventory}` : ''}`)
					}

					m.edit(await embed(0x000000, null)).catch(() => { return })

					const collectorFilter = i => i.user.id === interaction.user.id;
					const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
					if (confirmation.customId == "log") {
						await fs.writeFileSync('../logs.txt', `Starting Health:\n${p.name} (${p.level}) - ${p.maxHealth}/${p.maxHealth}\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Dealt: ${emaxHealth - ehealth}\nDamage Recieved: ${p.maxHealth - p.health}\n---\n\n${chatLog.join('\n\n')}\n\n---\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
						let file = await new AttachmentBuilder('../logs.txt');
						m.edit(await embed(0x000000, file)).catch(() => { return })
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
						setTimeout(async () => { m.edit(await embed(0xff0000, null)).catch(() => { return }) }, 500)
					} else if (badomen && !blessed) {
						let removal = stat == pstatus ? pstatus.filter(eff => eff.positive === true) : estatus.filter(eff => eff.positive === true)
						if (removal.length == 0) {
							chatLog.push(`${stat == pstatus ? p.name : e.name}'s effects (${await statusList(removal)}) were devastated 🏴`)
						}

						stat == pstatus ? pstatus = removal : estatus = removal
						setTimeout(async () => { m.edit(await embed(0xff0000, null)).catch(() => { return }) }, 500)
					} else if (!badomen && blessed) {
						let removal = stat == pstatus ? pstatus.filter(eff => eff.positive === false) : estatus.filter(eff => eff.positive === false)
						if (removal.length == 0) {
							chatLog.push(`${stat == pstatus ? p.name : e.name}'s effects (${await statusList(removal)}) were cleansed ✨`)
						}

						stat == pstatus ? pstatus = removal : estatus = removal
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
								let end = await assets.statuses.find(stat => stat.id === status.id).use(turn, xstatus, xhealth, chatLog, turn.name, emaxHealth)
								turn == p ? pstatus = end.statuses : estatus = end.statuses
								turn == p ? p.health = end.currentHealth : ehealth = end.currentHealth
								chatLog = end.chatLog
								m.edit(await embed(0xff0000, null)).catch(() => { return })
							} catch {
								return i--
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
							m.edit(await embed(0xff0000, null)).catch(() => { return })
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
				components: [row]
			}

			if (ended) {
				let row2 = new ActionRowBuilder()
				row2.addComponents(new ButtonBuilder()
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
						value: `${p.name}\nLevel ${p.level}`,
						inline: true
					},
					{
						name: `${ehealth == emaxHealth ? '💖' : (ehealth < emaxHealth / 2 && ehealth > 0 ? (p.weapon.name == "Wooden Bow" ? '💘' : '❤️‍🩹') : (ehealth <= 0 ? '💔' : (p.weapon.name == "Wooden Bow" ? '💘' : '❤️')))} ${ehealth}/${emaxHealth}`,
						value: `${e.name}\nLevel ${elevel}`,
						inline: true
					},
				]
				file ? false : embed.embeds[0].color = color
				file ? false : embed.embeds[0].footer.text = `${p.name}\n🪷 ${p.xp}/${Math.round((p.level / 0.07) ** 2)}`
				embed.components = file ? [] : [row2]
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