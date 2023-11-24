const v = require('vec3')
const { GoalBlock } = require('mineflayer-pathfinder').goals
const { once } = require('events')

module.exports = function load(bot, ns) {
	const switcher = ns.data['switch']

	const mcData = require('minecraft-data')(bot.version)

	ns.switch = {
		targetServer: null,
		serverJoinedAt: null,
		currentlySwitching: false
	}

	ns.switch.getTravelRoute = (relativeGoal) => {
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

	ns.switch.travelToPortal = async (relativePortalBlock) => {
		for (const relativeStopVec of ns.switch.getTravelRoute(relativePortalBlock)) {
			const absoluteStopVec = v(switcher.portalRoomSpawnBlock).plus(relativeStopVec).offset(0.5, 1, 0.5)

			bot.pathfinder.setGoal(new GoalBlock(absoluteStopVec.x, absoluteStopVec.y, absoluteStopVec.z))
			await once(bot, 'goal_reached')
		}
	}

	ns.switch.getPortalBlock = (server) => {
		const relativePortalBlock = v(switcher.relativePortalLocations[server])
		return v(switcher.portalRoomSpawnBlock).plus(relativePortalBlock)
	}

	ns.switch.getServerInformation = (server) => {
		const serverInfo = bot.pattern.hologram.findMatching(switcher.hologramPatterns.serverStatus, ns.switch.getPortalBlock(server))
		if (!serverInfo) {
			return {
				onlineStatus: 'Offline'
			}
		}
		const serverInfoMatches = bot.pattern.hologram.match(serverInfo, switcher.hologramPatterns.serverStatus)
		const [onlineStatusMatch, onlinePlayerCountMatch] = serverInfoMatches

		const [occupiedSlots, totalSlots] = onlinePlayerCountMatch.map(e => +e)

		return {
			onlineStatus: onlineStatusMatch[0],
			occupiedSlots,
			totalSlots
		}
	}

	ns.switch.canJoin = (server, rank = ns.playerUtils.getRank()) => {
		const { totalSlots, occupiedSlots, onlineStatus } = ns.switch.getServerInformation(server)

		let canJoin = false

		if (onlineStatus === 'Online') {
			const freeSlots = totalSlots - occupiedSlots
			if (
				freeSlots > 0 ||
				((freeSlots + switcher.rankCaps[rank]) > 0 && server !== 'cbevil')
			) {
				canJoin = true
			}
		}

		return canJoin
	}

	ns.switch.navigate = async () => {
		const targetServer = ns.switch.targetServer
		if (!targetServer) return

		if (ns.serverInfo.getTranslatedServer() === targetServer) {
			ns.switch.targetServer = null
			bot.pathfinder.setGoal(null)
			bot.clearControlStates()
			bot.emit('misc:switch->joinedTargetServer')
			return
		}

		if (ns.serverInfo.isHub()) {
			ns.switch.joinPortalroom()
		} else if (ns.serverInfo.isPortal()) {
			if (ns.switch.currentlySwitching) return
			bot.clearControlStates()
			await bot.waitForChunksToLoad()

			const relativePortalBlock = v(switcher.relativePortalLocations[targetServer])
			const closestAbsoluteStableBlock = v(switcher.portalRoomSpawnBlock).plus(relativePortalBlock).offset(0.5, 0, 0.5)

			const isInPortal = bot.entity.position.xzDistanceTo(closestAbsoluteStableBlock) < 2
			if (!isInPortal) {
				await ns.switch.travelToPortal(relativePortalBlock)

				const closestPortalBlock = bot.findBlocks({
					point: closestAbsoluteStableBlock.offset(0, 1 + bot.entity.height, 0),
					matching: [mcData.blocksByName['end_portal'].id, mcData.blocksByName['portal'].id],
					maxDistance: 5,
					count: 9
				})[0]
				await bot.lookAt(closestPortalBlock.offset(0.5, 0.5, 0.5), true)
			}

			await bot.delay(switcher.joinDelay - (Date.now() - ns.switch.serverJoinedAt))
			while (!ns.switch.canJoin(targetServer)) await bot.delay(10)
			bot.setControlState(isInPortal ? 'jump' : 'forward', true)
		} else {
			await bot.delay(10000 - (Date.now() - ns.switch.serverJoinedAt))
			ns.switch.toServer(targetServer)
			ns.switch.currentlySwitching = true
		}
	}

	bot.on('chat:switch->switchTimeout', async ([[date, time]]) => {
		const parsedDate = bot.parseFormattedDate(date, time)
		ns.switch.currentlySwitching = false
		ns.switch.serverJoinedAt = Date.now()
		await bot.delay((parsedDate + 1500) - Date.now()) // 1500 added for buffer
		ns.switch.navigate()
	})

	bot.on('chat:switch->switchFailed', () => {
		ns.switch.currentlySwitching = false
		ns.switch.serverJoinedAt = Date.now()
		ns.switch.navigate()
	})

	bot.on('chat:switch->serverFull', () => {
		ns.switch.currentlySwitching = false
		ns.switch.serverJoinedAt = Date.now()
		ns.switch.navigate()
	})

	bot.on('chat:switch->switchSucceeded', () => {
		ns.currentlySwitching = false
	})

	bot.on('misc:serverInfo->join', () => {
		ns.switch.serverJoinedAt = Date.now()
	})

	bot.once('misc:serverInfo->join', () => {
		bot.on('misc:serverInfo->join', ns.switch.navigate)
	})

	ns.switch.to = (cb) => {
		ns.switch.targetServer = cb
		ns.switch.navigate()
		return once(bot, 'misc:switch->joinedTargetServer').then(() => once(bot, 'chat:switch->loadedData'))
	}
}
