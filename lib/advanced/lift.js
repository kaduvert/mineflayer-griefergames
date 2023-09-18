module.exports = function inject(bot, options) {
    const lift = bot.hostData['lift']

    const awaitLanding = async () => {
        while (!bot.entity.onGround) {
            await bot.delay(1)
        }
    }

    bot.lift = {}

    bot.lift.go = async (up = true) => {
        const controlState = up ? 'jump' : 'sneak'

        bot.setControlState(controlState, true)
        bot.setControlState(controlState, false)

        awaitLanding().then(() => bot.emit('misc:lift->landed'))
        const result = await bot.getActionResult({
            successEvent: 'forcedMove',
            failureEvent: 'misc:lift->landed'
        })

        return result.hasSucceeded()
    }

    bot.lift.goUp = async () => {
        return bot.lift.go(true)
    }

    bot.lift.goDown = async () => {
        return bot.lift.go(false)
    }
}
