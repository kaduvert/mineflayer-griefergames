const v = require('vec3')

module.exports = function inject(bot, options) {
    const coordination = bot.hostData['plot'].coordination

    bot.plot.coordination = {}

    bot.plot.coordination.getPlotDimensions = (cb) => coordination.plotDimensions[cb] ?? coordination.plotDimensions.default

    bot.plot.coordination.getPlotSize = (plotDimensions) => plotDimensions.usableSize + (plotDimensions.padding + +plotDimensions.edge) * 2

    bot.plot.coordination.positionToId = (pos, cb = bot.serverInfo.getTranslatedServer()) => {
        const plotSize = bot.plot.coordination.getPlotSize(bot.plot.coordination.getPlotDimensions(cb))
        const plotX = Math.floor(pos.x / plotSize)
        const plotY = Math.floor(pos.z / plotSize)

        return [ plotX + coordination.offset, plotY + coordination.offset ]
    }

    bot.plot.coordination.idToPosition = (id, cb = bot.serverInfo.getTranslatedServer()) => {
        const plotSize = bot.plot.coordination.getPlotSize(bot.plot.coordination.getPlotDimensions(cb))
        const x = (id[0] * plotSize) - (coordination.offset * plotSize)
        const z = (id[1] * plotSize) - (coordination.offset * plotSize)

        return v(x, 0, z)
    }
}
