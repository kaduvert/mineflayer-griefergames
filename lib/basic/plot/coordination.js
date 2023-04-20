const v = require('vec3')

module.exports = function inject(bot, options) {
    const plot = bot.hostData['plot']

    bot.plot.coordination = {}

    bot.plot.coordination.getPlotDimensions = (cb) => plot.coordination.plotDimensions[cb] ?? plot.coordination.plotDimensions.default

    bot.plot.coordination.getPlotSize = (plotDimensions) => plotDimensions.usableSize + (plotDimensions.padding + +plotDimensions.edge) * 2

    bot.plot.coordination.positionToId = (pos, cb = bot.serverInfo.getTranslatedServer()) => {
        const plotSize = bot.plot.coordination.getPlotSize(bot.plot.coordination.getPlotDimensions(cb))
        const plotX = Math.floor(pos.x / plotSize)
        const plotY = Math.floor(pos.z / plotSize)

        return [ plotX + offset, plotY + offset ]
    }

    bot.plot.coordination.idToPosition = (id, cb = bot.serverInfo.getTranslatedServer()) => {
        const plotSize = bot.plot.coordination.getPlotSize(bot.plot.coordination.getPlotDimensions(cb))
        const x = (id[0] * plotSize) - (offset * plotSize)
        const z = (id[1] * plotSize) - (offset * plotSize)

        return v(x, 0, z)
    }
}
