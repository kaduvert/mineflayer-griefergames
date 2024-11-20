const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process')

module.exports = function inject(bot) {
	const rl = readline.createInterface({ input, output })
	rl.on('line', bot.gg.chat.send)
}
