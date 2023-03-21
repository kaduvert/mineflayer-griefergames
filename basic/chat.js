const chalk = require('chalk')

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	const chat = bot.loadPatternsAndGetData('chat')
	bot.chatNative = bot.chat
	bot.chat = {
		commandBatchStart: Date.now(),
		commandBatchCount: 0,
		commandSpamLock: false,
		lastCommand: null,
		sentMsgLately: false,
		commandErrorEvents: ['chat:blacklistError', 'chat:unknownCommandError', 'chat:insufficientPermissionsError'],
		events: new EventEmitter()
	}


	bot.chat.sendCommand = async (msg, priority = 3) => {
		if (Date.now() - bot.switch.serverJoinedAt < chat.commandBatchDelay) await bot.delay(chat.commandBatchDelay - (Date.now() - bot.switch.serverJoinedAt))
		while ((Date.now() - bot.chat.commandBatchStart) < chat.commandBatchDelay && bot.chat.commandBatchCount >= 3) await bot.delay(chat.commandBatchDelay - (Date.now() - bot.chat.commandBatchStart))

		const now = Date.now()
		if (now - bot.chat.commandBatchStart >= chat.commandBatchDelay) {
			bot.chat.commandBatchStart = now
			bot.chat.commandBatchCount = 0
		}
		bot.chat.commandBatchCount++

		if (bot.chat.commandSpamLock) await once(bot.chat.events, 'commandSpamLockReleased')

		bot.chat.lastCommand = msg
		bot.chatNative(msg)
	}

	bot.chat.sendMessage = async (msg) => {
		while (bot.chat.sentMsgLately) await once(bot.chat.events, 'messageCountdownExpired')

		bot.chatNative(msg)

		bot.chat.sentMsgLately = true
		await bot.delay([1, 10][+bot.slowChat.active] * 1000)
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
		if (msg.startsWith('/')) bot.chat.commandBatchCount--
		else bot.chat.sentMsgLately = false
	}

	bot.chat.getChatActionResult = (patternResolver, messageStruct, ...args) => {
		const msg = messageStruct instanceof Array ? bot.chat.buildCommand(bot.ggData[patternResolver].commands[messageStruct[0]], ...messageStruct.splice(1)) : messageStruct
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
				bot.once('chat:chat->spamWarning', sendToChat)
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.once(commandErrorEvent, onCommandError)
				})
			}
			bot.getActionResult(patternResolver, ...args).then((actionResult) => {
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.off(commandErrorEvent, onCommandError)
				})
				bot.removeListener('chat:chat->spamWarning', sendToChat)
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
		const waitDelay = (recommendedWaitDuration * 1000) || chat.commandBatchDelay
		bot.chat.commandSpamLock = true
		await bot.delay(waitDelay)
		bot.chat.events.emit('commandSpamLockReleased')
		bot.chat.commandSpamLock = false
	})

	bot.on('message', bot.chat.log)
	bot.on('chat:chat->blacklistError', bot.chat.onBlacklistError)
}
