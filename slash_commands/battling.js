const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const assets = require('./assets.js')

module.exports = {
	name: `battling`,

	async execute(bot, interaction, db, choice, weapon, armor, level) {
		if (!await db.get(`gamer_${interaction.user.id}`)) {
			await db.set(`gamer_${interaction.user.id}`, `1&100&100&30&0&10&30&0.95&0&0&0&0`)
		}
		let player = await db.get(`gamer_${interaction.user.id}`)
		player = player.split('&')
		weapon = assets.weapons[Number(weapon)] || assets.weapons[Number(player[10])]
		level = Number(level || player[0])
		armor = assets.armor[Number(armor)] || assets.armor[Number(player[11])]
		var p = {
			level: level,
			maxHealth: Math.round(Number(player[2]) + Number(50 * (level - 1))),
			health: Math.round(Number(player[2]) + Number(50 * (level - 1))),
			attack: Math.round(Number(player[3]) + Number(6 * (level - 1)) + Number(weapon.attack) + Number(weapon.level) + Number(level * Number(weapon.plvlmult))),
			defense: Number(player[4]) + Math.floor(0.2 * level),
			armor: Number(10 + Number(armor.armor) + Number(level * Number(armor.plvlmult)) + Number(Number(armor.level) * Number(armor.alvlmult))),
			stamina: Number(player[6]) + (5 * (level - 1)),
			maxStamina: Number(player[6]) + (5 * (level - 1)),
			accuracy: Number(player[7]),
			xp: Number(player[8]),
			blocking: false,
			critical: weapon.crit,
			weapon: weapon,
			evasion: armor.evasion
		}

		var e = assets.enemies[choice] || assets.enemies[Math.floor(Math.random() * assets.enemies.length)]
		e.accuracy -= p.evasion
		var ehealth = e.maxHealth
		var pstatus = []
		var estatus = []
		var buttons = []
		var chatLog = [`⚔️ ${interaction.user.username} vs. ${e.name} ⚔️`]
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
				y++
				buttons.push(attack)
				return;
			}
			if (y == 1) {
				let block = new ButtonBuilder()
					.setCustomId('block')
					.setLabel('Block')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('🛡️');
				row.addComponents(block)
				buttons.push(block)
			}
			skill.setCustomId(sk.name)
				.setLabel(`${sk.cost} - ${sk.name}`)
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

		interaction.reply(await embed()).then(async (m) => {
			async function battle() {
				var i = 0
				if (chatLog.length >= 10) chatLog = chatLog.slice(5)
				if (p.health > 0) {
					const collectorFilter = i => i.user.id === interaction.user.id;
					const confirmation = await m.awaitMessageComponent({ filter: collectorFilter });
					if (confirmation.customId === 'block') {
						p.blocking = true
						chatLog.push(`+ ${interaction.user.username} decides to block incoming damage with 🛡️${p.defense}`)
					} else {
						let skill = await p.weapon.skills.find(({ name }) => name == confirmation.customId)
						let hit = await hitMissCrit(p.accuracy, p.critical, pstatus)
						var logging = [`+ ${interaction.user.username} used ${skill.name}`]
						p.stamina -= skill.cost ? skill.cost : 0
						await playerSkill(hit, skill)

						if (skill.times && hit > 0) {
							chatLog.push(logging)
							logging[0] = `+ ${interaction.user.username} used ${skill.name} and hit ${e.name} for `
							m.edit(await embed())
							for (i = 0; i < skill.times; i++) {
								setTimeout(async () => {
									//if (p.health > 0) {
									let draft = (p.attack * (skill.damage || 1))
									let draft2 = draft + await debuffs(pstatus, draft, estatus)
									let finalHit = Math.round((draft2 + (draft2 * Math.random() * 0.05)) * (1 - e.defense / 10) * hit)
									if (hit == 1) logging.push(`⚔️${finalHit}`)
									else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
									else logging.push(`0`)
									ehealth = Math.round(ehealth - finalHit)

									logging = logging.filter((str) => str !== '')
									if (logging.length + 1 < skill.times) {
										if (logging.length == 2) chatLog[chatLog.length - 1] = logging.join('')
										else if (logging.length >= 3) chatLog[chatLog.length - 1] = logging[0] + logging.slice(1).join(', ')
									} else {
										chatLog[chatLog.length - 1] = logging[0] + logging.slice(1, -1).join(', ') + ', and ' + logging[logging.length - 1]
									}
									
									chatLog[chatLog.length - 1] = chatLog[chatLog.length - 1] + `${skill.estatus ? `\nInflicted: ${skill.estatus.join('')}` : ''}${skill.pstatus ? `\nGained: ${skill.pstatus.join('')}` : ''}`
									m.edit(await embed())
									if (i < skill.times - 1) chatLog[chatLog.length - 1] = String(chatLog[chatLog.length - 1]).replace(/(?<=\n).*/g, '')
									//} else { setTimeout(async () => { if (!ended) battle() }, 500 * i) }
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
								let draft = (p.attack * (skill.damage || 1))
								let draft2 = draft + await debuffs(pstatus, draft, estatus)
								let finalHit = Math.round((draft2 + (draft2 * Math.random() * 0.05)) * (1 - e.defense / 10) * hit)
								if (hit == 1) logging.push(`hit ${e.name} for ⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`hit ${e.name} for a CRITICAL ⚔️${finalHit}!`)
								else logging[0] = logging[0].replace('+ ', '') + ' and missed'
								ehealth = ehealth - finalHit
							} else {
								if (hit == 0 && !skill.health) logging[0] = logging[0].replace('+ ', '') + ' and missed'
							}

							(skill.pstatus || skill.estatus) && hit > 0 ? logging.push(`${skill.estatus ? `\nInflicted: ${skill.estatus.join('')}` : ''}${skill.pstatus ? `\nGained: ${skill.pstatus.join('')}` : ''}`) : false
							chatLog.push(logging.filter((str) => str !== '').join(' and '))
							setTimeout(async () => {
								m.edit(await embed())
							}, 500)
						}
					}
					await disableButtons(true, m)
					await confirmation.update(await embed()).catch(async () => { m.edit(await embed()) })
				} else {
					if (ended) return;
					ended = true
					await disableButtons(true, m)
					chatLog.push(`- 🌀 ${interaction.user.username} lost the battle 🌀`)
					m.edit(await embed())
				}

				setTimeout(async () => {
					if (ehealth > 0) {
						if (await estatus.find(({ id }) => id == '🏴') && !await estatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${e.name}'s positive effects were erradicated 🏴`)
							estatus.forEach(async stat => {
								if (stat.positive === true) estatus.splice(estatus.indexOf(stat), 1)
							})
							setTimeout(async () => { m.edit(await embed()) }, 500)
						} else if (!await estatus.find(({ id }) => id == '🏴') && await estatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${e.name}'s negative effects were cleansed ✨`)
							estatus.forEach(async stat => {
								if (stat.positive === false) estatus.splice(estatus.indexOf(stat), 1)
							})
							setTimeout(async () => { m.edit(await embed()) }, 500)
						} else if (await estatus.find(({ id }) => id == '🏴') && await estatus.find(({ id }) => id == '✨')) {
							chatLog.push(`${e.name}'s effects were cleansed and erradicated ✨🏴`)
							estatus = []
							setTimeout(async () => { m.edit(await embed()) }, 500)
						}

						var x = 0
						estatus.forEach(async status => {
							if (ehealth > 0) {
								setTimeout(async () => {
									try {
										let end = await assets.statuses.find(stat => stat.id === status.id).use(e, estatus, ehealth, chatLog, e.name)
										estatus = end.statuses
										ehealth = end.currentHealth
										chatLog = end.chatLog
										m.edit(await embed())
									} catch {
										return x--
									}
								}, (timer / 2) * x++)
							} else setTimeout(() => { if (!ended) ebattle() }, 500 * i++)
						})

						if (await estatus.find(({ id }) => id == '💫')) {
							chatLog.push(`${e.name} is stunned and their turn is skipped`)
							estatus.splice(estatus.indexOf(estatus.find(({ id }) => id == '💫')), 1)
							m.edit(embed())
							setTimeout(async () => {
								await disableButtons(false, m)
								setTimeout(() => { if (!ended) battle() }, 500 * x++)
							}, timer)
						} else {
							if (p.health > 0) setTimeout(() => { if (!ended) ebattle() }, (timer / 2) * x++)
							else setTimeout(() => { if (!ended) battle() }, (timer / 2) * x++)
						}
					} else setTimeout(() => { if (!ended) ebattle() }, 500 * x++)
				}, timer * i)
			}

			async function ebattle() {
				setTimeout(async () => {
					if (ehealth > 0) {
						let hit = await hitMissCrit(e.accuracy, e.critical, estatus)
						let skill = await choose(hit)
						var logging = [`- ${e.name} used ${skill.name}`]
						var i = 1
						if (skill.times && hit > 0) {
							chatLog.push(logging)
							logging[0] = `- ${e.name} used ${skill.name} and hit ${interaction.user.username} for `
							m.edit(await embed())
							for (i = 0; i < skill.times; i++) {
								setTimeout(async () => {
									//if (p.health > 0) {
									let hit = await hitMissCrit(e.accuracy, e.critical, estatus)
									let draft = (e.attack * (skill.damage || 1))
									let draft2 = draft + await debuffs(estatus, draft, pstatus)
									let finalHit = Math.round((draft2 + (draft2 * Math.random() * 0.05)) * (p.blocking ? (1 - p.defense / 10) : 1) * hit)
									if (hit == 1) logging.push(`⚔️${finalHit}`)
									else if (hit == 1.6) logging.push(`CRIT ⚔️${finalHit}`)
									else logging.push(`0`)
									p.health = Math.round(p.health - finalHit)

									logging = logging.filter((str) => str !== '')
									if (logging.length + 1 < skill.times) {
										if (logging.length == 2) chatLog[chatLog.length - 1] = logging.join('')
										else if (logging.length >= 3) chatLog[chatLog.length - 1] = logging[0] + logging.slice(1).join(', ')
									} else {
										chatLog[chatLog.length - 1] = logging[0] + logging.slice(1, -1).join(', ') + ', and ' + logging[logging.length - 1]
									}

									chatLog[chatLog.length - 1] = chatLog[chatLog.length - 1] + `${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}`
									m.edit(await embed())
									if (i < skill.times - 1) chatLog[chatLog.length - 1] = String(chatLog[chatLog.length - 1]).replace(/(?<=\n).*/g, '')
									//} else { setTimeout(async () => { if (!ended) battle() }, 500 * i) }
								}, 500 * i)
							}
						} else {
							if (skill.health) {
								let hit2 = hit
								if (hit2 == 0) hit2 = 1
								var healing = Math.round(e.maxHealth * skill.health * hit2)
								healing = (ehealth + healing > e.maxHealth) ? e.maxHealth - ehealth : healing
								if (hit2 == 1) logging.push(`healed for 💗${healing}`)
								else logging.push(`CRITICAL healed for 💗${healing}`)
								ehealth += healing
							}

							if (skill.attack || skill.damage) {
								let draft = (e.attack * (skill.damage || 1))
								let draft2 = draft + await debuffs(estatus, draft, pstatus)
								let finalHit = Math.round((draft2 + (draft2 * Math.random() * 0.05)) * (p.blocking ? (1 - p.defense / 10) : 1) * hit)
								if (hit == 1) logging.push(`hit ${interaction.user.username} for ⚔️${finalHit}`)
								else if (hit == 1.6) logging.push(`hit ${interaction.user.username} for a CRITICAL ⚔️${finalHit}!`)
								else logging[0] = logging[0].replace('- ', '') + ' and missed'
								p.health = p.health - finalHit
							} else {
								if (hit == 0 && !skill.health) logging[0] = logging[0].replace('- ', '') + ' and missed'
							}

							(skill.pstatus || skill.estatus) && hit > 0 ? logging.push(`${skill.pstatus ? `\nInflicted: ${skill.pstatus.join('')}` : ''}${skill.estatus ? `\nGained: ${skill.estatus.join('')}` : ''}`) : false
							chatLog.push(logging.filter((str) => str !== '').join(' and '))
							setTimeout(async () => {
								m.edit(await embed())
							}, 500)
						}

						setTimeout(async () => {
							if (p.health > 0) {
								if (await pstatus.find(({ id }) => id == '🏴') && !await pstatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${interaction.user.username}'s positive effects were erradicated 🏴`)
									pstatus.forEach(async stat => {
										if (stat.positive === true) pstatus.splice(pstatus.indexOf(stat), 1)
									})
									setTimeout(async () => { m.edit(await embed()) }, 500)
								} else if (!await pstatus.find(({ id }) => id == '🏴') && await pstatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${interaction.user.username}'s negative effects were cleansed ✨`)
									pstatus.forEach(async stat => {
										if (stat.positive === false) pstatus.splice(pstatus.indexOf(stat), 1)
									})
									setTimeout(async () => { m.edit(await embed()) }, 500)
								} else if (await pstatus.find(({ id }) => id == '🏴') && await pstatus.find(({ id }) => id == '✨')) {
									chatLog.push(`${interaction.user.username}'s effects were cleansed and erradicated ✨🏴`)
									pstatus = []
									setTimeout(async () => { m.edit(await embed()) }, 500)
								}

								var i = 1
								pstatus.forEach(async status => {
									if (p.health > 0) {
										setTimeout(async () => {
											try {
												let end = await assets.statuses.find(stat => stat.id === status.id).use(p, pstatus, p.health, chatLog, interaction.user.username)
												pstatus = end.statuses
												p.health = end.currentHealth
												chatLog = end.chatLog
												m.edit(await embed())
											} catch {
												return i--
											}
										}, (timer / 2) * i++)
									} else setTimeout(() => { if (!ended) battle() }, 500)
								})
								setTimeout(async () => {
									if (await pstatus.find(({ id }) => id == '💫')) {
										chatLog.push(`${interaction.user.username} is stunned`)
										pstatus.splice(pstatus.indexOf(pstatus.find(({ id }) => id == '💫')), 1)
										m.edit(await embed())
										if (p.health > 0) setTimeout(() => { if (!ended) ebattle() }, timer)
										else setTimeout(() => { if (!ended) battle() }, timer)
									} else {
										if (p.health > 0) {
											await disableButtons(false, m)
										}
										setTimeout(() => { if (!ended) battle() }, 500)
									}

								}, (timer / 2) * i++)
							} else setTimeout(() => { if (!ended) battle() }, 500)
						}, timer * i)
					} else {
						if (ended) return;
						ended = true
						chatLog.push(`+ 🎉 ${interaction.user.username} won the battle! 🎉`)
						await disableButtons(true, m)
					}
				}, 500)
			}
			battle()
		})
		async function embed() {
			let embed = {
				embeds: [
					{
						title: `${interaction.user.username.toUpperCase()} vs. ${e.name.toUpperCase()}`,
						thumbnail: {
							url: e.sprite
						},
						fields: [
							{
								name: `❤️ Enemy Health`,
								value: `${ehealth}/${e.maxHealth}\n${await statusList(estatus)}`,
								inline: true
							},
							{
								name: `⚔️ Enemy Attack`,
								value: `${e.attack}`,
								inline: true
							},
							{
								name: `🛡️ Enemy Defense`,
								value: `${e.defense}`,
								inline: true
							},
							{
								name: `Combat Log`,
								value: `\`\`\`diff\n${chatLog.slice(-5).join('\n')}\n\`\`\``,
								inline: false
							},
							{
								name: `❤️ Health`,
								value: `${p.health}/${p.maxHealth}\n${(await statusList(pstatus))}`,
								inline: true
							},
							{
								name: `⚔️ Attack`,
								value: `${p.attack}`,
								inline: true
							},
							{
								name: `🛡️ Defense`,
								value: `${p.defense}`,
								inline: true
							},
							{
								name: `👟 Stamina`,
								value: `${p.stamina}/${p.maxStamina}`,
								inline: true
							},
							{
								name: `${["🗡️", "🔪", "🏹"][Math.floor(Math.random() * 3)]} Weapon`,
								value: `${p.weapon.name}`,
								inline: true
							},
							{
								name: `👕 Armor`,
								value: `${armor.name}`,
								inline: true
							},
						]
					}
				],
				components: [row]
			}

			return embed;
		}

		async function disableButtons(boolean, m) {
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
			return await m.edit(await embed());
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
						if (skill.pstatus) {
							skill.pstatus.forEach(async (status) => {
								while (await pstatus.find(({ id }) => id == status)) {
									pstatus.splice(pstatus.indexOf(status), 1)
								}

								pstatus.push({
									id: status,
									length: assets.statuses.find(stat => stat.id == status).length,
									damage: skill.damage ? e.attack * skill.damage : e.attack
								})
							})
						}
						if (skill.estatus) {
							skill.estatus.forEach(async (status) => {
								while (await estatus.find(({ id }) => id == status)) {
									estatus.splice(estatus.indexOf(status), 1)
								}

								estatus.push({
									id: status,
									length: assets.statuses.find(stat => stat.id == status).length,
									damage: skill.damage ? e.attack * skill.damage : e.attack
								})
							})
						}
					}
					break;
				}
			}

			return skill ? skill : e.skills[0];
		}

		async function playerSkill(hitormiss, skill) {
			if (hitormiss > 0) {
				if (skill.pstatus) {
					skill.pstatus.forEach(async (status) => {
						while (await pstatus.find(({ id }) => id == status)) {
							pstatus.splice(pstatus.indexOf(status), 1)
						}
						pstatus.push({
							id: status,
							length: assets.statuses.find(stat => stat.id == status).length,
							damage: skill.damage ? p.attack * skill.damage : p.attack
						})
					})
				}
				if (skill.estatus) {
					skill.estatus.forEach(async (status) => {
						while (await estatus.find(({ id }) => id == status)) {
							estatus.splice(estatus.indexOf(status), 1)
						}
						estatus.push({
							id: status,
							length: assets.statuses.find(stat => stat.id == status).length,
							damage: skill.damage ? p.attack * skill.damage : p.attack
						})
					})
				}
			}

			return true;
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

		async function debuffs(EorP, currentAttack, EorP2) {
			var final = currentAttack
			EorP.forEach(async status => {
				if (status.id == '💢') {
					final += final * 0.5
				} else if (status.id == '💪') {
					final += final * 0.25
				} else if (status.id == '🏳️') {
					final += final * 0.5
				} else if (status.id == '🌀') {
					final -= final * 0.25
				}
			})

			EorP2.forEach(async status => {
				if (status.id == '🛡️') {
					final -= final * 0.20
				}
			})

			if (EorP === estatus) {
				final -= Number(p.armor)
			}

			if (final == currentAttack) return 0;
			else if (final * -1 > currentAttack) return currentAttack;
			else return final;
		}
	}
}