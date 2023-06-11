const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process')
const getTimestamp = () => `[${(new Date()).toLocaleTimeString()}]`

module.exports = function inject(bot, options) {
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

	const rl = readline.createInterface({ input, output })
	rl.on('line', bot.chat.send)
}
