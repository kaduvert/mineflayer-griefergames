const v = require('vec3')

module.exports = function load(bot, ns) {
    const coordination = ns.data['plot'].coordination

    ns.plot.coordination = {}

    ns.plot.coordination.getPlotDimensions = (cb) => coordination.plotDimensions[cb] ?? coordination.plotDimensions.default

    ns.plot.coordination.getPlotSize = (plotDimensions) => plotDimensions.usableSize + (plotDimensions.padding + +plotDimensions.edge) * 2

    ns.plot.coordination.positionToId = (pos = bot.entity.position, cb = ns.serverInfo.getTranslatedServer()) => {
        const plotDimensions = ns.plot.coordination.getPlotDimensions(cb)
        const plotSize = ns.plot.coordination.getPlotSize(plotDimensions)

        const paddingFraction = plotDimensions.padding % 1

        const plotX = Math.floor((pos.x - paddingFraction) / plotSize)
        const plotY = Math.floor((pos.z - paddingFraction) / plotSize)

        return [plotX + coordination.offset, plotY + coordination.offset]
    }

    ns.plot.coordination.idToPosition = (id, cb = ns.serverInfo.getTranslatedServer()) => {
        const plotDimensions = ns.plot.coordination.getPlotDimensions(cb)
        const plotSize = ns.plot.coordination.getPlotSize(plotDimensions)

        const paddingFraction = plotDimensions.padding % 1

        const x = (id[0] * plotSize) + paddingFraction - (coordination.offset * plotSize)
        const z = (id[1] * plotSize) + paddingFraction - (coordination.offset * plotSize)

        return v(x, 0, z)
    }
}
