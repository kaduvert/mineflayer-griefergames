const chalk = require('chalk')

const EventEmitter = require('events')
const { once } = require('events')

module.exports = function inject(bot, options) {
	bot.chatAddPattern(/^[^ ]+ \| [^ ]+ : (.*)/, 'blacklist')
	bot.chatAddPattern(/^Bitte unterlasse das Spammen von Commands\!$/, 'spamWarning')
	bot.chatAddPattern(/^\[Switcher\] Daten werden noch heruntergeladen\. Bitte warte \.\.\.$/, 'spamWarning')
	// bot.chatAddPattern(/^\[Start(?:Kick|Jail)\] Stimme für oder gegen (?:den Rauswurf|die Bestrafung) von ([^ ]+)/, 'punishment')
	
	bot.chatNative = bot.chat
	bot.chat = {
		cmdQueue: [[], [], []],
		sentCmdsLately: 0,
		activeCmdDelay: 0,
		sentMsgLately: false,
		slow: false,
		lastMessage: null,
		spamLock: false,
		events: new EventEmitter()
	}

	bot.chat.sendCommand = async (msg, priority = 3) => {
		bot.chat.cmdQueue[priority - 1].push(msg)
		while (bot.chat.sentCmdsLately > 2) await once(bot.chat.events, 'commandCountdownExpired')

		let msgToSend
		for (let i = 0; i < 3; i++) {
			if (bot.chat.cmdQueue[i].length) {
				msgToSend = bot.chat.cmdQueue[i].shift()
				break
			}
		}

		bot.chat.lastMessage = msg
		bot.chatNative(msgToSend)

		bot.chat.sentCmdsLately++
		const activeDelay = ++bot.chat.activeCmdDelay
		await bot.delay([1150, 2300, 3500][bot.chat.sentCmdsLately - 1])
		bot.chat.events.emit('commandCountdownExpired')
		if (activeDelay === bot.chat.activeCmdDelay) bot.chat.sentCmdsLately = 0
	}

	bot.chat.sendMessage = async (msg) => {
		while (bot.chat.sentMsgLately) await once(bot.chat.events, 'messageCountdownExpired')

		bot.chat.lastMessage = msg
		bot.chatNative(msg)

		bot.chat.sentMsgLately = true
		await bot.delay([1, 10][+bot.chat.slow] * 1000)
		bot.chat.sentMsgLately = false
		bot.chat.events.emit('messageCountdownExpired')
	}

	bot.chat.send = async (msg, priority) => {
		if (bot.chat.spamLock) await once(bot.chat.events, 'spamLockReleased')
		if (msg.startsWith('/')) bot.chat.sendCommand(msg, priority)
		else bot.chat.sendMessage(msg)
	}

	bot.chat.log = (msg, pos) => {
		if (bot.noLog) return
		const str = msg.toString()
		if (pos === 'game_info' || str === '»' || str === '') return
		console.log(chalk.cyan(bot.timeStamp()), msg.toAnsi())
	}

	bot.chat.blacklist = (msg) => {
		if (msg.startsWith('/')) bot.chat.sentCmdsLately--
		else bot.chat.sentMsgLately = false
	}

	bot.on('kicked', function logKick(reason) {
		reason = JSON.parse(reason).text
		console.log(chalk.red(bot.timeStamp()), chalk.yellowBright(`Kicked: ${chalk.red(reason)}`))
	})

	bot.on('spamWarning', async () => {
		bot.chat.spamLock = true
		bot.chat.send(bot.chat.lastMessage)
		await bot.delay(3500)
		bot.chat.events.emit('spamLockReleased')
		bot.chat.spamLock = false
	})

	bot.on('message', bot.chat.log)
	bot.on('blacklist', bot.chat.blacklist)

	bot.on('chatreset', () => (bot.chat.slow = false))
	bot.on('slowchat', () => (bot.chat.slow = true))
	bot.on('slowchatWarn', () => (bot.chat.slow = true))
}
