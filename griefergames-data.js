module.exports = function inject(bot, options) {
    const ggData = require('../node-griefergames-data')
    Object.keys(ggData).forEach(moduleName => {
        const commands = ggData[moduleName].commands
        if (commands) {
            Object.keys(commands).forEach(commandName => {
                const command = commands[commandName]
                ggData[moduleName].commands[commandName] = (...commandArgs) => {
                    let returnCommand = command
                    const commandArgMatches = returnCommand.match(/\$[1-9]+/g)
                    if (commandArgMatches) {
                        for (commandArgMatch of commandArgMatches) {
                            const commandIndex = +commandArgMatch.substring(1)
                            returnCommand = returnCommand.replace(new RegExp('\\$' + commandIndex, 'g'), (commandArgs[commandIndex - 1] ?? ''))
                        }
                    }
                    return returnCommand.trim()
                }
            })
        }
    })
    bot.ggData = ggData
}
