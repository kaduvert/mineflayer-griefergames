const v = require('vec3')
const chalk = require('chalk')
const { GoalBlock } = require('mineflayer-pathfinder').goals
const cbblocks = require('./coords/cbblocks.json')

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	const mcData = require('minecraft-data')(bot.version)

	bot.chatAddPattern(/^\[Switcher\] Daten heruntergeladen\!$/, 'loadedData')
	bot.chatAddPattern(/^Kicked whilst connecting to ([a-zA-Z0-9\-_]+): (.+)$/, 'switchFailed')
	bot.chatAddPattern(/^\[GrieferGames\] Du wurdest automatisch auf ([a-zA-Z0-9\-_]+) verbunden\.$/, 'switchSucceeded')
	bot.chatAddPattern(/^Der Server wird JETZT heruntergefahren!/, 'shutdown')

	bot.switcher = {
		targetServer: null,
		serverJoinedAt: null,
		currentlySwitching: false,
		cbStatusMap: {},
		events: new EventEmitter()
	}

	bot.switcher.getTravelRoute = (endBlock) => {
		if (endBlock.x === 309.5) {
			return [new GoalBlock(313.5, 65 + 1, 280.5),
			new GoalBlock(313.5, 65 + 1, endBlock.z),
			new GoalBlock(endBlock.x, 66 + 1, endBlock.z)
			]
		} else if (endBlock.x === 341.5) {
			return [new GoalBlock(337.5, 65 + 1, 280.5),
			new GoalBlock(337.5, 65 + 1, endBlock.z),
			new GoalBlock(endBlock.x, 66 + 1, endBlock.z)
			]
		} else if (endBlock.z === 240.5) {
			return [new GoalBlock(325.5, 65 + 1, 244.5),
			new GoalBlock(endBlock.x, 65 + 1, 244.5),
			new GoalBlock(endBlock.x, 66 + 1, endBlock.z)
			]
		} else if (endBlock.z === 320.5) {
			return [new GoalBlock(325.5, 65 + 1, 316.5),
			new GoalBlock(endBlock.x, 65 + 1, 316.5),
			new GoalBlock(endBlock.x, 66 + 1, endBlock.z)
			]
		}
		console.log(endBlock)
	}

	bot.switcher.travelToPortal = async (closestStableBlock) => {
		for (const stop of bot.switcher.getTravelRoute(closestStableBlock)) {
			bot.pathfinder.setGoal(stop)
			await once(bot, 'goal_reached')
		}
	}

	bot.switcher.getJoinableFromBotPosition = () => {
		const armorStands = Object.values(bot.entities).filter(e => e.objectType === 'Armor Stand' && !!e.metadata?.[2] && (e.position.distanceTo(bot.entity.position) < 3)).reduce((acc, curr) => [...acc, { nameTag: curr.metadata[2], position: curr.position }], [])
		let isJoinable = true
		for (const stand of armorStands) {
			const nameTag = stand.nameTag.replace(/§./g, '')
			if (/^\d+\/\d+$/.test(nameTag)) {
				const [onlinePlayers, maxPlayers] = nameTag.split('/').map(e => +e)
				if (maxPlayers - onlinePlayers <= 0) isJoinable = false
			} else if (/^[A-Z][a-z]+$/.test(nameTag)) {
				if (nameTag !== 'Online') isJoinable = false
			}
		}
		return isJoinable
	}

	bot.switcher.navigator = async (failedSwitch = false) => {
		const targetServer = bot.switcher.targetServer
		if (!targetServer) return

		if (bot.serverInfo.getTranslatedServer() === targetServer) {
			bot.switcher.targetServer = null
			bot.clearControlStates()
			bot.switcher.events.emit('joinedTargetServer')
			return
		}

		if (bot.serverInfo.isHub()) {
			bot.chat.send('/portal')
		} else if (bot.serverInfo.isPortal()) {
			if (bot.switcher.currentlySwitching) return
			await bot.waitForChunksToLoad()

			if (!failedSwitch) {
				const closestStableBlock = v(cbblocks[targetServer]).offset(0.5, 0, 0.5)
				await bot.switcher.travelToPortal(closestStableBlock)
	
				const closestPortalBlock = bot.findBlocks({
					point: closestStableBlock,
					matching: [mcData.blocksByName['end_portal'].id, mcData.blocksByName['portal'].id],
					maxDistance: 5,
					count: 9
				})[0]
				await bot.lookAt(closestPortalBlock, true)
			}

			await bot.delay(12000 - (Date.now() - bot.switcher.serverJoinedAt))
			while (!bot.switcher.getJoinableFromBotPosition()) await bot.delay(10)
			bot.setControlState(failedSwitch ? 'jump' : 'forward', true)
		} else {
			await bot.delay(10000 - (Date.now() - bot.switcher.serverJoinedAt))
			bot.chat.send('/switch ' + targetServer)
			bot.switcher.currentlySwitching = true
		}
	}

	bot.on('switchFailed', () => {
		bot.switcher.currentlySwitching = false
		bot.switcher.serverJoinedAt = Date.now()
		bot.clearControlStates()
		bot.switcher.navigator(true)
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
