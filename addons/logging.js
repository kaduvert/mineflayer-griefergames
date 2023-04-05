module.exports = function inject(bot, options) {
    const chalk = require('chalk')
    bot.chat.log = (msg, pos) => {
		if (bot.noLog) return
		const str = msg.toString()
		if (pos === 'game_info' || str === '»' || str === '') return
		console.log(chalk.cyan(bot.timeStamp()), msg.toAnsi())
	}

	bot.on('kicked', function logKick(reason) {
		reason = JSON.parse(reason).text
		console.log(chalk.red(bot.timeStamp()), chalk.yellowBright(`Kicked: ${chalk.red(reason)}`))
	})
}
