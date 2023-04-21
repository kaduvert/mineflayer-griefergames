const v = require('vec3')

module.exports = function inject(bot, options) {
    const coordination = bot.hostData['plot'].coordination

    bot.plot.coordination = {}

    bot.plot.coordination.getPlotDimensions = (cb) => coordination.plotDimensions[cb] ?? coordination.plotDimensions.default

    bot.plot.coordination.getPlotSize = (plotDimensions) => plotDimensions.usableSize + (plotDimensions.padding + +plotDimensions.edge) * 2

    bot.plot.coordination.positionToId = (pos = bot.entity.position, cb = bot.serverInfo.getTranslatedServer()) => {
        const plotDimensions = bot.plot.coordination.getPlotDimensions(cb)
        const plotSize = bot.plot.coordination.getPlotSize(plotDimensions)

        const paddingFraction = plotDimensions.padding % 1

        const plotX = Math.floor(pos.x - paddingFraction / plotSize)
        const plotY = Math.floor(pos.z - paddingFraction / plotSize)

        return [ plotX + coordination.offset, plotY + coordination.offset ]
    }

    bot.plot.coordination.idToPosition = (id, cb = bot.serverInfo.getTranslatedServer()) => {
        const plotDimensions = bot.plot.coordination.getPlotDimensions(cb)
        const plotSize = bot.plot.coordination.getPlotSize(plotDimensions)

        const paddingFraction = plotDimensions.padding % 1

        const x = (id[0] * plotSize) + paddingFraction - (coordination.offset * plotSize)
        const z = (id[1] * plotSize) + paddingFraction - (coordination.offset * plotSize)

        return v(x, 0, z)
    }
}
