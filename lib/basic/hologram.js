module.exports = function inject(bot, options) {
    bot.hologram = {}

    bot.hologram.hasNametag = (entity) => Boolean(entity.metadata?.[2])

    bot.hologram.getNametag = (entity) => entity.metadata[2]

    bot.hologram.isHologram = (entity) => entity.objectType === 'Armor Stand' && bot.hologram.hasNametag(entity)

    bot.hologram.group = (hologramEntities) => {
        const stackedHolograms = []

        for (const hologramEntity of hologramEntities) {
            let foundGroup = false
            stackedHologramsLoop:
            for (const group of stackedHolograms) {
                for (const groupedHologramEntity of group) {
                    if (
                        Math.abs(groupedHologramEntity.position.y - hologramEntity.position.y) <= 0.4 && // yDistance max 0.4 blocks
                        groupedHologramEntity.position.xzDistanceTo(hologramEntity.position) <= 0.1 // xzDistance max 0.1 blocks
                    ) {
                        group.push(hologramEntity)
                        foundGroup = true
                        break stackedHologramsLoop
                    }
                }
            }
            if (!foundGroup) {
                stackedHolograms.push([hologramEntity])
            }
        }
        stackedHolograms.forEach(group => bot.hologram.sort(group))

        return stackedHolograms
    }

    bot.hologram.sort = (stackedHolograms) => stackedHolograms.sort((a, b) => {
        const aY = a.position.y
        const bY = b.position.y
        const distance = bY - aY

        return distance / 0.25 // 0.25 is the usual y distance between hologramEntities
    })

    bot.hologram.extractText = (hologramEntities) => hologramEntities.map(bot.hologram.getNametag)

    bot.hologram.matchesPattern = (hologramTextArray, hologramPattern) => {
        if (!(hologramPattern instanceof Array)) {
            hologramPattern = [hologramPattern]
        }

        let matches = true
        if (hologramPattern?.length) {
            for (let i = 0; i < hologramPattern.length; i++) {
                matches = hologramTextArray[i] ? hologramPattern[i].test(hologramTextArray[i].replace(/§./g, '')) : false
                if (!matches) break
            }
        }
        return matches
    }

    bot.hologram.getPatternMatches = (hologramTextArray, hologramPattern) => {
        matches = []
        if (hologramPattern) {
            for (let i = 0; i < hologramPattern.length; i++) {
                matches[i] = hologramTextArray[i].replace(/§./g, '').match(hologramPattern[i]).splice(1)
            }
        }
        return matches
    }

    bot.hologram.getHolograms = (point) => 
        Object.values(bot.entities)
        .filter(bot.hologram.isHologram)
        // sort by closest distance
        .sort((a, b) => point.distanceTo(a.position) - point.distanceTo(b.position))

    bot.hologram.getMatchingHologram = (hologramPattern, point = bot.entity.position) => {
        const loadedHolograms = bot.hologram.getHolograms(point)
        const stackedHolograms = bot.hologram.group(loadedHolograms)

        for (const stackedHologram of stackedHolograms) {

            const stackedHologramText = bot.hologram.extractText(stackedHologram)

            if (bot.hologram.matchesPattern(stackedHologramText, hologramPattern)) {
                return stackedHologramText
            }
        }
        return null
    }
}
