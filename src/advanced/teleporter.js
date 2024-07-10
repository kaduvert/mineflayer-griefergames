module.exports = function load(bot, ns) {
    const teleporter = ns.data['teleporter']

    bot.on('windowOpen:teleporter->selectDestination', (window) => {
        window.teleportTo = function (destination) {
            const destinationItem = window.containerItems().find(stack => bot.pattern.item.match(stack, {
                display: [
                    new RegExp(`^${destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
                ],
                name: 'skull'
            }))

            if (destinationItem) {
                return bot.window.clickFallible({
                    window,
                    slotToClick: destinationItem.slot,
                    patternHead: 'teleporter',
                    successEvent: 'teleportSuccess',
                    failureEvent: '',
                    currentWindowPatternName: 'selectDestination',
                    timeout: 1000
                })
            } else {
                throw new Error('no teleporter named ' + destination)
            }
        }

        window.getDestinations = function () {
            return window.containerItems()
                .filter(stack => bot.pattern.item.match(stack, teleporter.itemPatterns.destination))
                .map(stack => bot.pattern.clearColorCodes(stack.customName))
        }
    })

    bot.on('windowOpen:teleporter->settings', (window) => {
        window.assertPublic = async function (destination) {
            const publicItem = window.containerItems().find(stack => bot.pattern.item.match(stack, teleporter.itemPatterns.public))
            let result
            do {
                result = await bot.window.clickFallible({
                    window,
                    slotToClick: publicItem.slot,
                    patternHead: 'teleporter',
                    failureEvent: '',
                    currentWindowPatternName: 'settings',
                    timeout: 1000
                })
            } while (!result.eventArgs[1].enchants?.length)
        }

        window.assertPrivate = async function (destination) {
            const privateItem = window.containerItems().find(stack => bot.pattern.item.match(stack, teleporter.itemPatterns.private))
            let result
            do {
                result = await bot.window.clickFallible({
                    window,
                    slotToClick: privateItem.slot,
                    patternHead: 'teleporter',
                    failureEvent: '',
                    currentWindowPatternName: 'settings',
                    timeout: 1000
                })
            } while (!result.eventArgs[1].enchants?.length)
        }
    })
}
