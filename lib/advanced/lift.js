module.exports = function inject(bot, options) {
    const lift = bot.hostData['lift']

    bot.lift = {}

    bot.lift.nextReadyAt = 0

    bot.lift.go = async (up = true) => {
        const controlState = up ? 'jump' : 'sneak'

        await bot.delay(bot.lift.nextReadyAt - Date.now())

        bot.setControlState(controlState, true)
        bot.setControlState(controlState, false)

        const result = await bot.getActionResult({
            successEvent: 'forcedMove',
            timeout: 1000 + bot.player.ping
        })

        if (controlState === 'jump') bot.lift.nextReadyAt = Date.now() + 150 + bot.player.ping

        return result.hasSucceeded()
    }

    bot.lift.goUp = async () => {
        return bot.lift.go(true)
    }

    bot.lift.goDown = async () => {
        return bot.lift.go(false)
    }
}