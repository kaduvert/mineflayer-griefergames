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
		events: new EventEmitter()
	}

	bot.switcher.navigator = async () => {
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
			const closestStableBlock = v(cbblocks[targetServer])
			await bot.pathfinder.goto(new GoalBlock(closestStableBlock.x, closestStableBlock.y + 1, closestStableBlock.z))

			const closestPortalBlock = bot.findBlocks({
				point: closestStableBlock,
				matching: [mcData.blocksByName['end_portal'].id, mcData.blocksByName['portal'].id],
				maxDistance: 5,
				count: 9
			})[0]
			await bot.lookAt(closestPortalBlock, true)
			await bot.delay(12000 - (new Date() - bot.switcher.serverJoinedAt))
			bot.setControlState('forward', true)
		} else {
			bot.chat.send('/switch ' + targetServer)
			bot.switcher.currentlySwitching = true
		}
	}

	bot.on('switchFailed', () => {
		bot.switcher.currentlySwitching = false
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
