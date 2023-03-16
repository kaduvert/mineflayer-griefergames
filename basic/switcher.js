const v = require('vec3')
const chalk = require('chalk')
const { GoalBlock } = require('mineflayer-pathfinder').goals

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	const switcherData = bot.ggData.switcher
	bot.loadChatPatterns(switcherData)

	const mcData = require('minecraft-data')(bot.version)

	const rankCaps = {
		'Spieler': 0,
		'Premium': 50,
		'Ultra': 50,
		'Legende': 50,
		'Titan': 85,
		'Griefer': 115,
		'Supreme': 150
	}

	bot.switcher = {
		targetServer: null,
		serverJoinedAt: null,
		switchTimeout: null,
		currentlySwitching: false,
		cbStatusMap: {},
		events: new EventEmitter()
	}

	bot.switcher.getTravelRoute = (relativeEndBlock) => {
		const route = null
		const onXAxis = Math.abs(relativeEndBlock.x) === 16
		const onPositiveAxis = (onXAxis ? relativeEndBlock.x : relativeEndBlock.z) > 0
		if (onXAxis) {
			route = [
				v(onPositiveAxis ? 12 : -12, -1, 0),
				v(onPositiveAxis ? 12 : -12, -1, relativeEndBlock.z)
			]
		} else {
			route = [
				v(0, -1, onPositiveAxis ? 36 : -36),
				v(relativeEndBlock.x, -1, onPositiveAxis ? 36 : -36)
			]
		}
		route.push(v(relativeEndBlock.x, 0, relativeEndBlock.z))
		return route
	}

	bot.switcher.travelToPortal = async (relativePortalBlock) => {
		for (const relativeStopVec of bot.switcher.getTravelRoute(relativePortalBlock)) {
			const absoluteStopVec = v(switcherData.portalRoomSpawnBlock).offset(relativeStopVec).offset(0.5, 1, 0.5)
			bot.pathfinder.setGoal(new GoalBlock(absoluteStopVec.x, absoluteStopVec.y, absoluteStopVec.z))
			await once(bot, 'goal_reached')
		}
	}

	bot.switcher.isRankPermittedToJoin = (server, freeSlots, rank = bot.playerUtils.getRank()) => {
		return (
			(freeSlots > 0) ||
			((freeSlots + rankCaps[rank]) > 0 && server !== 'cbevil')
		)
	}

	bot.switcher.getJoinableFromBotPosition = () => {
		const armorStands = Object.values(bot.entities).filter(e => e.objectType === 'Armor Stand' && !!e.metadata?.[2] && (e.position.distanceTo(bot.entity.position) < 3)).reduce((acc, curr) => [...acc, { nameTag: curr.metadata[2], position: curr.position }], [])
		let isJoinable = true
		for (const stand of armorStands) {
			const nameTag = stand.nameTag.replace(/§./g, '')
			if (/^\d+\/\d+$/.test(nameTag)) {
				const [onlinePlayers, maxPlayers] = nameTag.split('/').map(e => +e)
				const freeSlots = maxPlayers - onlinePlayers
				if (!bot.switcher.isRankPermittedToJoin(bot.switcher.targetServer, freeSlots)) isJoinable = false
			} else if (/^[A-Z][a-z]+$/.test(nameTag)) {
				if (nameTag !== 'Online') isJoinable = false
			}
		}
		return isJoinable
	}

	bot.switcher.navigator = async () => {
		const targetServer = bot.switcher.targetServer
		if (!targetServer) return

		if (bot.serverInfo.getTranslatedServer() === targetServer) {
			bot.switcher.targetServer = null
			bot.pathfinder.setGoal(null)
			bot.clearControlStates()
			bot.switcher.events.emit('joinedTargetServer')
			return
		}

		if (bot.serverInfo.isHub()) {
			bot.chat.send('/portal')
		} else if (bot.serverInfo.isPortal()) {
			if (bot.switcher.currentlySwitching) return
			bot.clearControlStates()
			await bot.waitForChunksToLoad()

			const relativePortalBlock = v(switcherData.relativePortalLocations[targetServer])
			const closestAbsoluteStableBlock = v(switcherData.portalRoomSpawnBlock).offset(relativePortalBlock).offset(0.5, 0, 0.5)
			const isInPortal = bot.entity.position.xzDistanceTo(closestAbsoluteStableBlock) < 2
			if (!isInPortal) {
				await bot.switcher.travelToPortal(relativePortalBlock)

				const closestPortalBlock = bot.findBlocks({
					point: closestAbsoluteStableBlock.offset(0, 1 + bot.entity.height, 0),
					matching: [mcData.blocksByName['end_portal'].id, mcData.blocksByName['portal'].id],
					maxDistance: 5,
					count: 9
				})[0]
				await bot.lookAt(closestPortalBlock.offset(0.5, 0.5, 0.5), true)
			}

			await bot.delay(12000 - (Date.now() - bot.switcher.serverJoinedAt))
			while (!bot.switcher.getJoinableFromBotPosition()) await bot.delay(10)
			bot.setControlState(isInPortal ? 'jump' : 'forward', true)
		} else {
			await bot.delay(10000 - (Date.now() - bot.switcher.serverJoinedAt))
			bot.chat.send('/switch ' + targetServer)
			bot.switcher.currentlySwitching = true
		}
	}

	bot.on('switchTimeout', async () => { // TODO: optimize for minimal waiting
		bot.switcher.currentlySwitching = false
		bot.switcher.serverJoinedAt = Date.now()
		await bot.delay(5 * 60 * 1000)
		bot.switcher.navigator()
	})

	bot.on('switchFailed', () => {
		bot.switcher.currentlySwitching = false
		bot.switcher.serverJoinedAt = Date.now()
		bot.switcher.navigator()
	})

	bot.on('serverFull', () => {
		bot.switcher.currentlySwitching = false
		bot.switcher.serverJoinedAt = Date.now()
		bot.switcher.navigator()
	})

	bot.on('switchSucceeded', () => {
		bot.currentlySwitching = false
	})

	bot.serverInfo.events.on('join', () => {
		bot.switcher.serverJoinedAt = Date.now()
	})

	bot.serverInfo.events.on('join', bot.switcher.navigator)

	bot.switcher.goto = (cb) => {
		bot.switcher.targetServer = cb
		bot.switcher.navigator()
	}
}
