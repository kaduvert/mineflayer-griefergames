const v = require('vec3')
const chalk = require('chalk')
const { GoalBlock } = require('mineflayer-pathfinder').goals

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	const switcher = bot.hostData['switch']

	const mcData = require('minecraft-data')(bot.version)

	Object.assign(bot.switch, {
		targetServer: null,
		serverJoinedAt: null,
		currentlySwitching: false
	})

	bot.switch.getTravelRoute = (relativeGoal) => {
		let route = null
		const onXAxis = Math.abs(relativeGoal.x) === 16
		const onPositiveAxis = (onXAxis ? relativeGoal.x : relativeGoal.z) > 0
		if (onXAxis) {
			route = [
				v(onPositiveAxis ? 12 : -12, -1, 0),
				v(onPositiveAxis ? 12 : -12, -1, relativeGoal.z)
			]
		} else {
			route = [
				v(0, -1, onPositiveAxis ? 36 : -36),
				v(relativeGoal.x, -1, onPositiveAxis ? 36 : -36)
			]
		}
		route.push(v(relativeGoal.x, relativeGoal.y, relativeGoal.z))
		return route
	}

	bot.switch.travelToPortal = async (relativePortalBlock) => {
		for (const relativeStopVec of bot.switch.getTravelRoute(relativePortalBlock)) {
			const absoluteStopVec = v(switcher.portalRoomSpawnBlock).plus(relativeStopVec).offset(0.5, 1, 0.5)

			bot.pathfinder.setGoal(new GoalBlock(absoluteStopVec.x, absoluteStopVec.y, absoluteStopVec.z))
			await once(bot, 'goal_reached')
		}
	}

	bot.switch.getPortalBlock = (server) => {
		const relativePortalBlock = v(switcher.relativePortalLocations[server])
		return v(switcher.portalRoomSpawnBlock).plus(relativePortalBlock)
	}

	bot.switch.getServerStatus = (server) => {
		const serverInfo = bot.pattern.hologram.findMatching(switcher.hologramPatterns.serverStatus, bot.switch.getPortalBlock(server))
		const serverInfoMatches = bot.pattern.hologram.match(serverInfo, switcher.hologramPatterns.serverStatus)
		const [onlineStatusMatch, onlinePlayerCountMatch] = serverInfoMatches

		const [occupiedSlots, totalSlots] = onlinePlayerCountMatch.map(e => +e)

		return {
			onlineStatus: onlineStatusMatch[0],
			occupiedSlots,
			totalSlots
		}
	}

	bot.switch.canJoin = (server, rank = bot.playerUtils.getRank()) => {
		const { totalSlots, occupiedSlots, serverStatus } = bot.switch.getServerInformation(server)
		
		const freeSlots = totalSlots - occupiedSlots
		let canJoin = freeSlots > 0 || ((freeSlots + switcher.rankCaps[rank]) > 0 && server !== 'cbevil')

		if (serverStatus !== 'Online') canJoin = false

		return canJoin
	}

	bot.switch.navigate = async () => {
		const targetServer = bot.switch.targetServer
		if (!targetServer) return

		if (bot.serverInfo.getTranslatedServer() === targetServer) {
			bot.switch.targetServer = null
			bot.pathfinder.setGoal(null)
			bot.clearControlStates()
			bot.emit('misc:switch->joinedTargetServer')
			return
		}

		if (bot.serverInfo.isHub()) {
			bot.chat.send('/portal')
		} else if (bot.serverInfo.isPortal()) {
			if (bot.switch.currentlySwitching) return
			bot.clearControlStates()
			await bot.waitForChunksToLoad()

			const relativePortalBlock = v(switcher.relativePortalLocations[targetServer])
			const closestAbsoluteStableBlock = v(switcher.portalRoomSpawnBlock).plus(relativePortalBlock).offset(0.5, 0, 0.5)

			const isInPortal = bot.entity.position.xzDistanceTo(closestAbsoluteStableBlock) < 2
			if (!isInPortal) {
				await bot.switch.travelToPortal(relativePortalBlock)

				const closestPortalBlock = bot.findBlocks({
					point: closestAbsoluteStableBlock.offset(0, 1 + bot.entity.height, 0),
					matching: [mcData.blocksByName['end_portal'].id, mcData.blocksByName['portal'].id],
					maxDistance: 5,
					count: 9
				})[0]
				await bot.lookAt(closestPortalBlock.offset(0.5, 0.5, 0.5), true)
			}

			await bot.delay(switcher.joinDelay - (Date.now() - bot.switch.serverJoinedAt))
			while (!bot.switch.canJoin(targetServer)) await bot.delay(10)
			bot.setControlState(isInPortal ? 'jump' : 'forward', true)
		} else {
			await bot.delay(10000 - (Date.now() - bot.switch.serverJoinedAt))
			bot.chat.send('/switch ' + targetServer)
			bot.switch.currentlySwitching = true
		}
	}

	bot.on('chat:switch->switchTimeout', async ([[date, time]]) => {
		const parsedDate = bot.parseFormattedDate(date, time)
		bot.switch.currentlySwitching = false
		bot.switch.serverJoinedAt = Date.now()
		await bot.delay((parsedDate + 1500) - Date.now()) // 1500 added for buffer
		bot.switch.navigate()
	})

	bot.on('chat:switch->switchFailed', () => {
		bot.switch.currentlySwitching = false
		bot.switch.serverJoinedAt = Date.now()
		bot.switch.navigate()
	})

	bot.on('chat:switch->serverFull', () => {
		bot.switch.currentlySwitching = false
		bot.switch.serverJoinedAt = Date.now()
		bot.switch.navigate()
	})

	bot.on('chat:switch->switchSucceeded', () => {
		bot.currentlySwitching = false
	})

	bot.on('misc:serverInfo->join', () => {
		bot.switch.serverJoinedAt = Date.now()
	})

	bot.on('misc:serverInfo->join', bot.switch.navigate)

	bot.switch.to = (cb) => {
		bot.switch.targetServer = cb
		bot.switch.navigate()
		return once(bot, 'misc:switch->joinedTargetServer').then(() => once(bot, 'chat:switch->loadedData'))
	}
}
