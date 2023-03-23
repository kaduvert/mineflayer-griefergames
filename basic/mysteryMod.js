const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    const mysteryMod = bot.loadPatternsAndGetData('mysteryMod')

    bot.mysteryMod = {
        events: new EventEmitter()
    }

    bot.mysteryMod.events.on('redstone', (data) => {
        if (+data.status === 0) return
        console.log(`DEBUG: event mysteryMod.events->redstone triggered with unusual data:\n${data}`)
    })

    bot.mysteryMod.events.on('bank', (data) => {
        bot.bank.balance = +data.amount
    })

    bot.mysteryMod.events.on('countdown_create', (data) => {
        if (data.name === 'ClearLag') {
            if (data.unit === 'SECONDS') {
                bot.itemClear.nextAt = Date.now() + (data.until * 1000)
            }
        } else {
            console.log(`DEBUG: event mysteryMod.events->countdown_create triggered with unusual data:\n${data}`)
        }
    })

    bot.mysteryMod.sendPayload = (jsonData) => {
        bot._client.write('custom_payload', { channel: mysteryMod.packetChannelName, data: Buffer.from(JSON.stringify(jsonData)) })
    }

    bot._client.on('packet', (data, meta) => {
        if (meta.name !== 'custom_payload' || data.channel !== mysteryMod.packetChannelName) return
        const buf = data.data
        const bufString = buf.toString()
        const eventEndIndex = buf[0] + 1
        const eventName = bufString.substring(1, eventEndIndex)
        const eventData = bufString.substring(eventEndIndex + 1, bufString.length)

        bot.mysteryMod.events.emit(eventName, JSON.parse(eventData))
    })
}
