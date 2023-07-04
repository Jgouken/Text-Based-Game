const { ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const fs = require('fs')

module.exports = {
	name: `battling`,

	async execute(bot, interaction, db, weapon, armor, level, choice, area, enemylvl, assets) {
		/*
		if (!await db.get(`gamer_${interaction.user.id}`)) {
			await db.set(`gamer_${interaction.user.id}`, )
		}
		let player = await db.get(`gamer_${interaction.user.id}`)
		*/

		player = `1&1000&30&0&10&30&0.95&0&0&0`.split('&')
		weapon = assets.weapons[Number(weapon)] || assets.weapons[Number(player[8])]
		level = Number(level || player[0])
		armor = assets.armor[Number(armor)] || assets.armor[Number(player[9])]

		var p = {
			name: interaction.member.nickname || interaction.member.displayName || interaction.user.username,
			level: level,
			maxHealth: Math.round(Number(player[1]) + Number(50 * (level - 1))),
			health: Math.round(Number(player[1]) + Number(50 * (level - 1))),
			attack: Math.round(Number(player[2]) + Number(6 * (level - 1)) + Number(weapon.attack) + Number(weapon.level) + Number(level * Number(weapon.plvlmult))),
			defense: Number(player[3]) + Math.floor(0.2 * level),
			armor: Math.round(Number(Number(player[4]) + Number(armor.armor) + Number(level * Number(armor.plvlmult)) + Number(Number(armor.level) * Number(armor.alvlmult)))),
			stamina: Number(player[5]) + (5 * (level - 1)),
			maxStamina: Number(player[5]) + (5 * (level - 1)),
			accuracy: Number(player[6]),
			xp: Number(player[7]),
			critical: weapon.crit,
			weapon: weapon,
			evasion: armor.evasion
		}

		var e;
		if (area) {
			var choiceArea = assets.areas[choice] || assets.areas[Math.floor(Math.random() * assets.areas.length)]
			while (!e) e = assets.enemies.find(({ name }) => name.toLowerCase().trim() == choiceArea.enemies[Math.floor(Math.random() * choiceArea.enemies.length)].toLowerCase().trim())
			elevel = Math.floor(Math.random() * (choiceArea.maxlvl - choiceArea.minlvl) + choiceArea.minlvl)
		} else {
			e = assets.enemies[choice] || assets.enemies[Math.floor(Math.random() * assets.enemies.length)]
			elevel = Math.round(enemylvl) || 1
		}

		var emaxHealth = Math.round(e.maxHealth + ((elevel / 2) ** 1.72424))
		var eattack = Math.round(e.attack + (elevel ** 1.62424))
		var eaccuracy = e.accuracy - p.evasion + (.0025 * (elevel - 1))
		var ecritical = e.critical + (.000125 * (elevel - 1))
		var exp = e.xp + ((p.level * (emaxHealth / eattack)) ** 2)
		var ehealth = emaxHealth

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
			row.addComponents(skill)
			buttons.push(skill)
			y++
		})
		interaction.reply(await embed(0x00ff00, null)).then(async (m) => {
			async function battle() {
				await disableButtons(false);
				var i = 0
				const collectorFilter = i => i.user.id === interaction.user.id;
				const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
				let skill = await p.weapon.skills.find(({ name }) => name == confirmation.customId)
				let hit = await hitMissCrit(p.accuracy, p.critical, pstatus)
				var logging = [`+ ${p.name} used ${skill.name}`]
				p.stamina -= skill.cost ? skill.cost : 0
				await playerSkill(hit, skill)

				if (skill.times && hit > 0) {
					chatLog.push(logging)
					logging[0] = `+ ${p.name} used ${skill.name} and hit ${e.name} for `
					m.edit(await embed(0xff0000, null))
					for (i = 0; i < skill.times; i++) {
						setTimeout(async () => {
							let draft = p.attack + await debuffs(pstatus, p.attack, estatus, logging)
							let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * (1 - e.defense / 10) * hit * (skill.damage || 1))
							var chatIndex = chatLog.length - 1
							for (q = chatLog.length; q > -1; q--) { if (chatLog[q] ? String(chatLog[q]).startsWith(`- ${e.name} used ${skill.name}`) : false) chatIndex = q }
							if (hit == 1) logging.push(`⚔️${finalHit}`)
							else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
							else logging.push(`0`)
							ehealth = Math.round(ehealth - finalHit)

							logging = logging.filter((str) => str !== '')
							chatLog[chatIndex] = logging[0] + logging.slice(1).join(', ') + `${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}`
							m.edit(await embed(0xff0000, null))
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
						let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * (1 - e.defense / 10) * hit * (skill.damage || 1))
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
						m.edit(await embed(0xff0000, null))
					}, 500)
				}
				await disableButtons(true)
				await confirmation.update(await embed(0xff0000, null)).catch(async () => { m.edit(await embed(0xff0000, null)) })

				setTimeout(async () => {
					contin(e)
				}, timer * i)
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
						m.edit(await embed(0xff0000, null))
						for (i = 0; i < skill.times; i++) {
							setTimeout(async () => {
								let hit = await hitMissCrit(eaccuracy, ecritical, estatus)
								let draft = eattack + await debuffs(estatus, eattack, pstatus, logging)
								let finalHit = Math.round((draft + (draft * Math.random() * 0.05)) * hit * (skill.damage || 1))
								var chatIndex = chatLog.length - 1
								for (q = chatLog.length; q > -1; q--) { if (chatLog[q] ? String(chatLog[q]).startsWith(`- ${e.name} used ${skill.name}`) : false) chatIndex = q }
								p.armor >= finalHit / 2 ? finalHit -= Math.round(finalHit / 2) : finalHit -= p.armor
								if (hit == 1) logging.push(`⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
								else logging.push(`0`)
								p.health -= finalHit

								logging = logging.filter((str) => str !== '')
								chatLog[chatIndex] = logging[0] + logging.slice(1).join(', ') + `${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}`
								m.edit(await embed(0xff0000, null))
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
							p.armor >= finalHit / 2 ? finalHit -= Math.round(finalHit / 2) : finalHit -= p.armor
							//if (finalHit < 0) finalHit = 0
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
							m.edit(await embed(0xff0000, null))
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
									while (await pstatus.find(({ id }) => id == status)) {
										pstatus.splice(pstatus.indexOf(status), 1)
									}

									if (pblessed && !(await skill.pstatus.find(str => str == "🏴"))) {
										if (!(await assets.statuses.find(stat => stat.id == status).positive)) {
											setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200)
											return;
										}
									} else if (pbadomen && !(await skill.pstatus.find(str => str == "✨"))) {
										if ((await assets.statuses.find(stat => stat.id == status).positive)) {
											setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200)
											return;
										}
									}

									pstatus.push({
										id: status,
										length: await assets.statuses.find(stat => stat.id == status).length,
										damage: skill.damage ? p.attack * skill.damage : p.attack,
										positive: await assets.statuses.find(stat => stat.id == status).positive
									})
								})

								if (await pstatus.find(({ id }) => id == '🏴') && await pstatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${p.name}'s effects were cleansed and erradicated ✨🏴`)
									pstatus = []
								}
							}

							if (skill.estatus) {
								skill.estatus.forEach(async (status) => {
									while (await estatus.find(({ id }) => id == status)) {
										estatus.splice(estatus.indexOf(status), 1)
									}

									if (eblessed && !(await skill.estatus.find(str => str == "🏴"))) {
										if (!(await assets.statuses.find(stat => stat.id == status).positive)) {
											setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200)
											return;
										}
									} else if (ebadomen && !(await skill.estatus.find(str => str == "✨"))) {
										if ((await assets.statuses.find(stat => stat.id == status).positive)) {
											setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200)
											return;
										}
									}

									estatus.push({
										id: status,
										length: await assets.statuses.find(stat => stat.id == status).length,
										damage: skill.damage ? eattack * skill.damage : eattack,
										positive: await assets.statuses.find(stat => stat.id == status).positive
									})
								})

								if (await estatus.find(({ id }) => id == '🏴') && await estatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${e.name}'s effects were cleansed and erradicated ✨🏴`)
									estatus = []
								}
							}
						}
						m.edit(embed(0xff0000, null))
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
							while (await pstatus.find(({ id }) => id == status)) {
								pstatus.splice(pstatus.indexOf(status), 1)
							}

							if (pblessed && !(await skill.pstatus.find(str => str == "🏴"))) {
								if (!(await assets.statuses.find(stat => stat.id == status).positive)) {
									setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200)
									return;
								}
							} else if (pbadomen && !(await skill.pstatus.find(str => str == "✨"))) {
								if ((await assets.statuses.find(stat => stat.id == status).positive)) {
									setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200)
									return;
								}
							}

							pstatus.push({
								id: status,
								length: await assets.statuses.find(stat => stat.id == status).length,
								damage: skill.damage ? p.attack * skill.damage : p.attack,
								positive: await assets.statuses.find(stat => stat.id == status).positive
							})
						})

						if (await pstatus.find(({ id }) => id == '🏴') && await pstatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${p.name}'s effects were cleansed and erradicated ✨🏴`)
							pstatus = []
						}
					}

					if (skill.estatus) {
						skill.estatus.forEach(async (status) => {
							while (await estatus.find(({ id }) => id == status)) {
								estatus.splice(estatus.indexOf(status), 1)
							}

							if (eblessed && !(await skill.estatus.find(str => str == "🏴"))) {
								if (!(await assets.statuses.find(stat => stat.id == status).positive)) {
									setTimeout(() => { chatLog.push(`${status} was countered ✨`) }, skill.times ? skill.times * 500 + 200 : 200)
									return;
								}
							} else if (ebadomen && !(await skill.estatus.find(str => str == "✨"))) {
								if ((await assets.statuses.find(stat => stat.id == status).positive)) {
									setTimeout(() => { chatLog.push(`${status} was blocked 🏴`) }, skill.times ? skill.times * 500 + 200 : 200)
									return;
								}
							}

							estatus.push({
								id: status,
								length: await assets.statuses.find(stat => stat.id == status).length,
								damage: skill.damage ? p.attack * skill.damage : p.attack,
								positive: await assets.statuses.find(stat => stat.id == status).positive
							})
						})

						if (await estatus.find(({ id }) => id == '🏴') && await estatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${e.name}'s effects were cleansed and erradicated ✨🏴`)
							estatus = []
						}
					}
				}
				m.edit(embed(0xff0000, null))
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
				return await m.edit(await embed(ended ? 0x000000 : 0x00ff00));
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
						chatLog.push(`🎉 ${p.name} won the battle! 🎉`)
					}

					m.edit(await embed(0x000000, null))

					const collectorFilter = i => i.user.id === interaction.user.id;
					const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
					if (confirmation.customId == "log") {
						await fs.writeFileSync('../logs.txt', `Starting Health:\n${p.name} (${p.level}) - ${p.maxHealth}/${p.maxHealth}\n${e.name} (${elevel}) - ${emaxHealth}/${emaxHealth}\n\nTotal Rounds: ${chatLog.length - 2}\nDamage Dealt: ${emaxHealth - ehealth}\nDamage Recieved: ${p.maxHealth - p.health}\n--\n\n${chatLog.join('\n\n')}\n\n--\nRemaining Health:\n${p.name} - ${p.health}/${p.maxHealth}\n${e.name} - ${ehealth}/${emaxHealth}`)
						let file = await new AttachmentBuilder('../logs.txt');
						m.edit(await embed(0x000000, file))
					}
					return;
				}

				let xstatus = turn == p ? pstatus : estatus
				let xhealth = turn == p ? p.health : ehealth

				var xi = false
				var stunned = false
				var i = 1

				let badomen = await xstatus.find(({ id }) => id == '🏴')
				let blessed = await xstatus.find(({ id }) => id == '✨')
				var statsees = []

				if (badomen && blessed) {
					chatLog.push(`${turn.name}'s effects were cleansed and erradicated ✨🏴`)
					if (turn == p) pstatus = []
					else estatus = []
					console.log(estatus)
					setTimeout(async () => { m.edit(await embed(0xff0000, null)) }, 500)
				} else if (badomen && !blessed) {
					while (await xstatus.find(({ positive }) => positive === true)) {
						xstatus.forEach(async stat => {
							if (stat.positive === true) {
								turn == p ? pstatus.splice(xstatus.indexOf(stat), 1) : estatus.splice(xstatus.indexOf(stat), 1)
								statsees.push(stat.id)
								xi = true
							}
						})
					}
					if (!xi) chatLog.push(`${turn.name}'s bad omen lingers idly 🏴`)
					else chatLog.push(`${turn.name}'s positive effects (${statsees.join('')}) were erradicated 🏴`)
					setTimeout(async () => { m.edit(await embed(0xff0000, null)) }, 500)
				} else if (!badomen && blessed) {
					while (await xstatus.find(({ positive }) => positive === false)) {
						xstatus.forEach(async stat => {
							if (stat.positive === false) {
								turn == p ? pstatus.splice(pstatus.indexOf(stat), 1) : estatus.splice(estatus.indexOf(stat), 1)
								statsees.push(stat.id)
								xi = true
							}
						})
					}
					if (!xi) chatLog.push(`${turn.name}'s blessing gleams idly ✨`)
					else chatLog.push(`${turn.name}'s negative effects (${statsees.join('')}) were cleansed ✨`)
					setTimeout(async () => { m.edit(await embed(0xff0000, null)) }, 500)
				}

				xstatus.forEach(async status => {
					if (xhealth > 0) {
						setTimeout(async () => {
							try {
								let end = await assets.statuses.find(stat => stat.id === status.id).use(turn, xstatus, xhealth, chatLog, turn.name)
								turn == p ? pstatus = end.statuses : estatus = end.statuses
								turn == p ? p.health = end.currentHealth : ehealth = end.currentHealth
								chatLog = end.chatLog
								m.edit(await embed(0xff0000, null))
							} catch {
								return i--
							}
						}, (timer / 2) * i++)
					} else setTimeout(() => { contin(turn) }, 500)
				})

				if (xhealth > 0) {
					setTimeout(async () => {
						if (await xstatus.find(({ id }) => id == '💫')) {
							stunned = true
							chatLog.push(`${turn.name} is stunned`)
							xstatus == pstatus ? pstatus.splice(pstatus.indexOf(pstatus.find(({ id }) => id == '💫')), 1) : estatus.splice(estatus.indexOf(estatus.find(({ id }) => id == '💫')), 1)
							m.edit(await embed(0xff0000, null))
						}

						if (xhealth > 0) {
							if (turn == p) { if (stunned) { contin(e); } else { battle(); await disableButtons(false); } }
							else stunned ? contin(p) : ebattle()
						} else contin(turn)
					}, (timer / 2) * i++)
				} else contin(turn)
			}

			contin(p)
		})

		async function embed(color, file) {
			var embed = {
				embeds: [
					{
						//title: `${p.name.toUpperCase()} vs. ${e.name.toUpperCase()}`,
						color: color,
						author: {
							name: `${e.name}`,
							icon_url: e.sprite
						},
						thumbnail: {
							url: e.sprite
						},
						fields: [
							{
								name: `❤️ ${ehealth}/${emaxHealth}`,
								value: `Level ${elevel}\n${await statusList(estatus) || ''}`,
								inline: true
							},
							{
								name: `⚔️ ${eattack}`,
								value: e.weapon || "None",
								inline: true
							},
							{
								name: `🛡️ ${e.defense * 10}%`,
								value: 'Reduction',
								inline: true
							},
							{
								name: `Combat Log`,
								value: `\`\`\`diff\n${chatLog.slice(-5).join('\n')}\n\`\`\``,
								inline: false
							},
							{
								name: `❤️ ${p.health}/${p.maxHealth}`,
								value: `Level ${p.level}\n${await statusList(pstatus) || ''}`,
								inline: true
							},
							{
								name: `⚔️ ${p.attack}`,
								value: p.weapon.name,
								inline: true
							},
							{
								name: `🪖 ${p.armor}`,
								value: armor.name,
								inline: true
							},
							{
								name: `⚡ ${p.stamina}/${p.maxStamina}`,
								value: 'Stamina',
								inline: true
							},
							{
								name: `💥 ${p.critical * 100}%`,
								value: 'Crit Rate',
								inline: true
							},
							{
								name: `💨 ${String(p.evasion * 100).slice(0, 4)}%`,
								value: 'Evasion',
								inline: true
							},
						],
						footer: {
							text: `${p.name} - ${p.level}\n🪷 ${p.xp}/${Math.round((p.level / 0.07) ** 2)}`,
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
						value: `\`\`\`diff\n${chatLog.slice(-5).join('\n')}\n\`\`\``,
						inline: false
					},
					{
						name: `❤️ ${p.health}/${p.maxHealth}`,
						value: `Level ${p.level}\n${await statusList(pstatus) || ''}`,
						inline: true
					},
					{
						name: `❤️ ${ehealth}/${emaxHealth}`,
						value: `Level ${elevel}\n${await statusList(estatus) || ''}`,
						inline: true
					},
				]
				file ? false : embed.embeds[0].color = color
				embed.components = file ?  [] : [row2]
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