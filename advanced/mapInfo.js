const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const mapInfo = bot.ggData.mapInfo
    bot.loadChatPatterns(mapInfo)

	bot.mapInfo = {
        listening: false,
        current: [],
        events: new EventEmitter()
	}

	bot.mapInfo.parse = (raw) => {
        const mapInfo = raw.join('\n').match(mapInfo.multiLineRegex)
        if (!mapInfo) return null
        const [_, serverId, dynamicId, server, world, creator, width, height, scale, originalId, dataSize, firstBytesCount, firstBytes] = plotInfo
        return {
            serverId,
			dynamicId: +dynamicId,
			server,
			world,
			creator,
			width: +width,
			height: +height,
			scale: +scale,
			originalId,
			dataSize: +dataSize,
			firstBytesCount: +firstBytesCount,
			firstBytes
        }
    }

    bot.mapInfo.getRaw = () => {
        return bot.chat.getChatActionResult(mapInfo.commands.get(), 'mapInfo', ['mapInfoNoDataError'], 5000)
    }

	bot.on('message', (msg, pos) => {
        if (!bot.mapInfo.listening || pos !== 'system' || msg === '»') return
        bot.mapInfo.current.push(msg)
    })

    bot.on('mapInfoStart', () => {
        bot.mapInfo.listening = true
        bot.mapInfo.current = []
    })

    bot.on('mapInfoEnd', () => {
        bot.mapInfo.listening = false
        bot.mapInfo.events.emit('mapInfo', [...bot.mapInfo.current]) // clone it!
    })
}



/*
 * sample mapinfo message:

Minecraft Server ID: 
Dynamische ID: 7413
Server: CB7
World: 49855e62-101d-4cc3-af26-154ad4338fd0
Ersteller: -
Erstellt: 29.02.2020 02:22:21
Breite: 128px
Höhe: 128px
Skalierung: 0
Ursprüngliche ID: map_14231
Data Size: 16384bytes
First 20 bytes: [3434343434343434343434343434343434343434]

 */