const { once } = require('events')

module.exports = function load(bot, ns) {
	const chat = ns['chat'].data

	Object.assign(ns.chat, {
		commandBatchStart: Date.now(),
		commandBatchCount: 0,
		commandSpamLock: false,
		lastCommand: null,
		sentMsgLately: false,
		commandErrorEvents: ['chat:chat->blacklistError', 'chat:chat->unknownCommandError', 'chat:chat->insufficientPermissionsError']
	})

	ns.chat.sendCommand = async (msg) => {
		if (Date.now() - ns.switch.serverJoinedAt < chat.commandBatchDelay) await bot.delay(chat.commandBatchDelay - (Date.now() - ns.switch.serverJoinedAt))
		while ((Date.now() - ns.chat.commandBatchStart) < chat.commandBatchDelay && ns.chat.commandBatchCount >= 3) await bot.delay(chat.commandBatchDelay - (Date.now() - ns.chat.commandBatchStart))

		const now = Date.now()
		if (now - ns.chat.commandBatchStart >= chat.commandBatchDelay) {
			ns.chat.commandBatchStart = now
			ns.chat.commandBatchCount = 0
		}
		ns.chat.commandBatchCount++

		if (ns.chat.commandSpamLock) await once(bot, 'misc:chat->commandSpamLockReleased')

		ns.chat.lastCommand = msg
		bot.chat(msg)
	}

	ns.chat.sendMessage = async (msg) => {
		while (ns.chat.sentMsgLately) await once(bot, 'misc:chat->messageCountdownExpired')

		bot.chat(msg)

		ns.chat.sentMsgLately = true
		setTimeout(() => {
			ns.chat.sentMsgLately = false
			bot.emit('misc:chat->messageCountdownExpired')
		}, [1, 10][+ns.slowChat.active] * 1000)
	}

	ns.chat.send = (msg) => {
		return msg.startsWith('/') ?
			ns.chat.sendCommand(msg) :
			ns.chat.sendMessage(msg)
	}

	ns.chat.onBlacklistError = ([[msg]]) => {
		if (msg.startsWith('/')) ns.chat.commandBatchCount--
		else ns.chat.sentMsgLately = false
	}

	ns.chat.sendFallible = (options) => {
		const {
			message
		} = options

		return new Promise((res) => {
			const onCommandError = (commandErrorEvent, ...eventArgs) => {
				res(new bot.ActionResult(bot.actionResultStatus.FAILURE, commandErrorEvent, eventArgs))
			}
			const sendToChat = () => {
				bot.once('chat:chat->spamWarning', sendToChat)
				ns.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.once(commandErrorEvent, onCommandError)
				})
				return ns.chat.send(message)
			}
			sendToChat().then(() => {
				bot.getActionResult(options).then((actionResult) => {
					ns.chat.commandErrorEvents.forEach(commandErrorEvent => {
						bot.off(commandErrorEvent, onCommandError)
					})
					bot.off('chat:chat->spamWarning', sendToChat)
					res(actionResult)
				})
			})
		})
	}

	bot.on('chat:chat->spamWarning', async ([[recommendedWaitDuration]]) => {
		const waitDelay = (recommendedWaitDuration * 1000) || chat.commandBatchDelay
		ns.chat.commandSpamLock = true
		await bot.delay(waitDelay)
		bot.emit('misc:chat->commandSpamLockReleased')
		ns.chat.commandSpamLock = false
	})

	bot.on('chat:chat->blacklistError', ns.chat.onBlacklistError)
}
