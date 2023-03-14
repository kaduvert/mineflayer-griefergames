const chalk = require('chalk')

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^\[Chat\] Der Chat wurde von \S+ ┃ \S+ auf normal gestellt\.$/, 'chatreset')
	bot.chatAddPattern(/^\[Chat\] Der Chat wurde von \S+ ┃ \S+ verlangsamt\.$/, 'slowchat')
	bot.chatAddPattern(/^\[GrieferGames\] Du kannst nur jede 10 Sekunden schreiben\.$/, 'slowchatWarn')

	bot.chatAddPattern(/^\[\S+\] Du kannst diesen Befehl erst nach (\d+) Sekunden benutzen\.$/, 'spamWarning')
	bot.chatAddPattern(/^\[\S+\] Du musst (\d+) Sekunden warten, bevor du diesen Befehl erneut ausführen kannst\.$/, 'spamWarning')
	bot.chatAddPattern(/^\[\S+\] Du kannst diesen Befehl nur alle (\d+) Sekunden benutzen\.$/, 'spamWarning')
	bot.chatAddPattern(/^\[GrieferGames\] Bitte warte kurz\.$/, 'spamWarning')
	bot.chatAddPattern(/^Bitte unterlasse das Spammen von Commands\!$/, 'spamWarning')
	bot.chatAddPattern(/^\[Switcher\] Daten werden noch heruntergeladen\. Bitte warte \.\.\.$/, 'spamWarning')

	bot.chatAddPattern(/^(?:\[.+\] )?(\S+) ┃ (\S+) » (.*)$/, 'playerChatMessage')
	bot.chatAddPattern(/^\[Rundruf\] (.*)$/, 'broadcast')

	bot.chatAddPattern(/^\S+ \| \S+ : (.*)/, 'blacklistError')
	bot.chatAddPattern(/^Unknown command\. Type "\/help" for help\.$/, 'unknownCommandError')
	bot.chatAddPattern(/^I'm sorry, but you do not have permission to perform this command\. Please contact the server administrators if you believe that this is in error\.$/, 'insufficientPermissionsError')
	bot.chatAddPattern(/^Unzureichende Rechte\.$/, 'insufficientPermissionsError')

	const CMD_BATCH_DELAY = 3600
	
	bot.chatNative = bot.chat
	bot.chat = {
		cmdQueue: [[], [], []],
		cmdBatchStart: Date.now(),
		cmdBatchCount: 0,
		cmdSpamLock: false,
		lastCommand: null,
		sentMsgLately: false,
		slow: false,
		commandErrorEvents: ['blacklistError', 'unknownCommandError', 'insufficientPermissionsError'],
		events: new EventEmitter()
	}

	bot.chat.sendCommand = async (msg, priority = 3) => {
		if (bot.chat.cmdSpamLock) await once(bot.chat.events, 'cmdSpamLockReleased')
		bot.chat.cmdQueue[priority - 1].push(msg)
		while ((Date.now() - bot.chat.cmdBatchStart) < CMD_BATCH_DELAY && bot.chat.cmdBatchCount >= 3) await bot.delay(CMD_BATCH_DELAY - (Date.now() - bot.chat.cmdBatchStart))

		let msgToSend
		for (let i = 0; i < 3; i++) {
			if (bot.chat.cmdQueue[i].length) {
				msgToSend = bot.chat.cmdQueue[i].shift()
				break
			}
		}

		bot.chat.lastCommand = msgToSend
		bot.chatNative(msgToSend)

		const now = Date.now()
		if (now - bot.chat.cmdBatchStart >= CMD_BATCH_DELAY) {
			bot.chat.cmdBatchStart = now
			bot.chat.cmdBatchCount = 0
		}
		bot.chat.cmdBatchCount++
	}

	bot.chat.sendMessage = async (msg) => {
		while (bot.chat.sentMsgLately) await once(bot.chat.events, 'messageCountdownExpired')

		bot.chatNative(msg)

		bot.chat.sentMsgLately = true
		await bot.delay([1, 10][+bot.chat.slow] * 1000)
		bot.chat.sentMsgLately = false
		bot.chat.events.emit('messageCountdownExpired')
	}

	bot.chat.send = async (msg, priority) => {
		if (msg.startsWith('/')) bot.chat.sendCommand(msg, priority)
		else bot.chat.sendMessage(msg)
	}

	bot.chat.log = (msg, pos) => {
		if (bot.noLog) return
		const str = msg.toString()
		if (pos === 'game_info' || str === '»' || str === '') return
		console.log(chalk.cyan(bot.timeStamp()), msg.toAnsi())
	}

	bot.chat.onBlacklistError = (msg) => {
		if (msg.startsWith('/')) bot.chat.cmdBatchCount--
		else bot.chat.sentMsgLately = false
	}

	bot.chat.getChatActionResult = (msg, ...args) => {
		return new Promise((res) => {
			const onCommandError = (commandErrorEvent, ...eventArgs) => {
                res({
                    status: 1,
                    triggeredEvent: commandErrorEvent,
                    eventArgs: eventArgs
                })
            }
			const sendToChat = () => {
				bot.chat.send(msg)
				bot.once('spamWarning', sendToChat)
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.once(commandErrorEvent, onCommandError)
				})
			}
			bot.getActionResult(...args).then((actionResult) => {
				bot.chat.commandErrorEvents.forEach(commandErrorEvent => {
					bot.off(commandErrorEvent, onCommandError)
				})
				bot.removeListener('spamWarning', sendToChat)
				res(actionResult)
			})
			sendToChat()
		})
	}

	bot.on('kicked', function logKick(reason) {
		reason = JSON.parse(reason).text
		console.log(chalk.red(bot.timeStamp()), chalk.yellowBright(`Kicked: ${chalk.red(reason)}`))
	})

	bot.on('spamWarning', async (recommendedWaitDuration) => {
		const waitDelay = (recommendedWaitDuration * 1000) || 3500
		bot.chat.cmdSpamLock = true
		await bot.delay(waitDelay)
		bot.chat.events.emit('cmdSpamLockReleased')
		bot.chat.cmdSpamLock = false
	})

	bot.on('message', bot.chat.log)
	bot.on('blacklistError', bot.chat.onBlacklistError)

	bot.on('chatreset', () => (bot.chat.slow = false))
	bot.on('slowchat', () => (bot.chat.slow = true))
	bot.on('slowchatWarn', () => (bot.chat.slow = true))
}
