module.exports = function load(bot, ns) {
    const lift = ns.data['lift']
    const { once } = require('events')

    ns.lift = {}

    ns.lift.nextReadyAt = 0

    ns.lift.go = async (up = true) => {
        const controlState = up ? 'jump' : 'sneak'

        await bot.delay(ns.lift.nextReadyAt - Date.now())

        bot.setControlState(controlState, true)
        bot.setControlState(controlState, false)

        const result = await bot.getActionResult({
            successEvent: 'forcedMove',
            timeout: 1000 + bot.player.ping
        })

        if (controlState === 'jump') ns.lift.nextReadyAt = Date.now() + 150 + bot.player.ping

        return result.hasSucceeded()
    }

    ns.lift.goUp = async () => {
        return ns.lift.go(true)
    }

    ns.lift.goDown = async () => {
        return ns.lift.go(false)
    }

    ns.lift.block = async (liftBlockPosition, state, forceLook = false) => {
        const desiredBlock = bot.registry.blocksByName['daylight_detector' + (state ? '' : '_inverted')]

        let liftBlock = null
        while ((liftBlock = bot.blockAt(liftBlockPosition)).type !== desiredBlock.id) {
            await bot.lookAt(liftBlock.position.offset(0.5, 0.5, 0.5), forceLook)
            await bot.activateBlock(liftBlock)
            await once(bot.world, 'blockUpdate:' + liftBlock.position.toString())
        }
    }
}
