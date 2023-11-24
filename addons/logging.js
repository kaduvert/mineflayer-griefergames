const getTimestamp = () => `[${(new Date()).toLocaleTimeString()}]`

module.exports = function load(bot, ns) {
	const chalk = require('chalk')
	bot.on('message', (msg, pos) => {
		if (bot.noLog && !msg.toString().toLowerCase().includes('parrot')) return
		const str = msg.toString()
		if (pos === 'game_info' || str === '»' || str === '') return
		console.log(chalk.cyan(getTimestamp()), msg.toAnsi())
	})

	bot.on('kicked', (reason) => {
		reason = JSON.parse(reason).text
		console.log(chalk.red(getTimestamp()), chalk.yellowBright(`Kicked: ${chalk.red(reason)}`))
	})
}
