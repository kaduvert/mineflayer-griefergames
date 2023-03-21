const chalk = require('chalk')

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	const chat = bot.ggData.chat

	bot.chatNative = bot.chat
	bot.chat = {
		cmdQueue: [[], [], []],
		cmdBatchStart: Date.now(),
		cmdBatchCount: 0,
		cmdSpamLock: false,
		lastCommand: null,
		sentMsgLately: false,
		slow: false,
		commandErrorEvents: ['chat:blacklistError', 'chat:unknownCommandError', 'chat:insufficientPermissionsError'],
		events: new EventEmitter()
	}

	bot.chat.loadPatterns = (ggDataObj) => {
		const chatPatterns = ggDataObj.chatPatterns
		Object.keys(chatPatterns).forEach(chatPatternName => {
			const chatPattern = chatPatterns[chatPatternName]
			if (chatPattern instanceof RegExp) {
				bot.addChatPattern(chatPatternName, chatPattern, { repeat: true, parse: true })
			} else if (chatPattern instanceof Array) {
				bot.addChatPatternSet(chatPatternName, chatPattern, { repeat: true, parse: true })
			}
		})
	}
	bot.chat.loadPatterns(chat)

	bot.chat.sendCommand = async (msg, priority = 3) => {
		bot.chat.cmdQueue[priority - 1].push(msg)
		if (Date.now() - bot.switcher.serverJoinedAt < chat.cmdBatchDelay) await bot.delay(chat.cmdBatchDelay - (Date.now() - bot.switcher.serverJoinedAt))
		while ((Date.now() - bot.chat.cmdBatchStart) < chat.cmdBatchDelay && bot.chat.cmdBatchCount >= 3) await bot.delay(chat.cmdBatchDelay - (Date.now() - bot.chat.cmdBatchStart))

		const now = Date.now()
		if (now - bot.chat.cmdBatchStart >= chat.cmdBatchDelay) {
			bot.chat.cmdBatchStart = now
			bot.chat.cmdBatchCount = 0
		}
		bot.chat.cmdBatchCount++

		if (bot.chat.cmdSpamLock) await once(bot.chat.events, 'cmdSpamLockReleased')

		let msgToSend
		for (let i = 0; i < 3; i++) {
			if (bot.chat.cmdQueue[i].length) {
				msgToSend = bot.chat.cmdQueue[i].shift()
				break
			}
		}

		bot.chat.lastCommand = msgToSend
		bot.chatNative(msgToSend)
	}

	bot.chat.sendMessage = async (msg) => {
		while (bot.chat.sentMsgLately) await once(bot.chat.events, 'messageCountdownExpired')

		bot.chatNative(msg)

		bot.chat.sentMsgLately = true
		await bot.delay([1, 10][+bot.chat.slow] * 1000)
		bot.chat.sentMsgLately = false
		bot.chat.events.emit('messageCountdownExpired')
	}

	bot.chat.send = (msg, priority) => {
		return msg.startsWith('/') ?
		bot.chat.sendCommand(msg, priority) :
		bot.chat.sendMessage(msg)
	}

	bot.chat.log = (msg, pos) => {
		if (bot.noLog) return
		const str = msg.toString()
		if (pos === 'game_info' || str === '»' || str === '') return
		console.log(chalk.cyan(bot.timeStamp()), msg.toAnsi())
	}

	bot.chat.onBlacklistError = ([[msg]]) => {
		if (msg.startsWith('/')) bot.chat.cmdBatchCount--
		else bot.chat.sentMsgLately = false
	}

	bot.chat.getChatActionResult = (msg, ...args) => {
		return new Promise((res) => {
			const onCommandError = (commandErrorEvent, ...eventArgs) => {
				res({
					status: 1,
					event: commandErrorEvent,
					eventArgs: eventArgs
				})
			}
			const sendToChat = () => {
				bot.chat.send(msg)
				bot.once('chat:spamWarning', sendToChat)
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.once(commandErrorEvent, onCommandError)
				})
			}
			bot.getActionResult(...args).then((actionResult) => {
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.off(commandErrorEvent, onCommandError)
				})
				bot.removeListener('chat:spamWarning', sendToChat)
				res(actionResult)
			})
			sendToChat()
		})
	}

	bot.chat.buildCommand = (blueprint, ...commandArgs) => {
		let returnCommand = blueprint
		const commandArgMatches = returnCommand.match(/\$[1-9]+/g)
		if (commandArgMatches) {
			for (commandArgMatch of commandArgMatches) {
				const commandIndex = +commandArgMatch.substring(1)
				returnCommand = returnCommand.replace(new RegExp('\\$' + commandIndex, 'g'), (commandArgs[commandIndex - 1] ?? ''))
			}
		}
		return returnCommand.trim()
	}

	bot.on('kicked', function logKick(reason) {
		reason = JSON.parse(reason).text
		console.log(chalk.red(bot.timeStamp()), chalk.yellowBright(`Kicked: ${chalk.red(reason)}`))
	})

	bot.on('chat:spamWarning', async ([[recommendedWaitDuration]]) => {
		const waitDelay = (recommendedWaitDuration * 1000) || chat.cmdBatchDelay
		bot.chat.cmdSpamLock = true
		await bot.delay(waitDelay)
		bot.chat.events.emit('cmdSpamLockReleased')
		bot.chat.cmdSpamLock = false
	})

	bot.on('message', bot.chat.log)
	bot.on('chat:blacklistError', bot.chat.onBlacklistError)

	bot.on('chat:chatreset', () => (bot.chat.slow = false))
	bot.on('chat:slowchat', () => (bot.chat.slow = true))
	bot.on('chat:slowchatWarn', () => (bot.chat.slow = true))
}
