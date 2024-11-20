module.exports = function load(bot, ns) {
	const mysteryMod = ns['mysteryMod'].data

	ns.mysteryMod.subtitleMap = {}

	bot.on('misc:mysteryMod->user_subtitle', (subtitles) => {
		for (const subtitle of subtitles) {

			if (!ns.mysteryMod.subtitleMap[subtitle.targetId]) ns.mysteryMod.subtitleMap[subtitle.targetId] = {}

			ns.mysteryMod.subtitleMap[subtitle.targetId][subtitle.scale] = subtitle.text
		}
	})

	bot.on('misc:mysteryMod->redstone', (data) => {
		/**
		 * data.status definitions:
		 * -1 = unknown
		 * 0 = enabled
		 * 1 = restricted
		 * not 1 = disabled
		 */
	})

	bot.on('misc:mysteryMod->bank', (data) => {
		ns.bank.balance = +data.amount
	})

	bot.on('misc:mysteryMod->countdown_create', (data) => {
		if (data.name === 'ClearLag') {
			if (data.unit === 'SECONDS') {
				ns.itemClear.nextAt = new Date(Date.now() + (data.until * 1000))
			}
		} else {
			console.log(`DEBUG: event mysteryMod.events->countdown_create triggered with unusual data:\n${data}`)
		}
	})

	ns.mysteryMod.sendPayload = (jsonData) => {
		bot._client.write('custom_payload', { channel: mysteryMod.packetChannelName, data: Buffer.from(JSON.stringify(jsonData)) })
	}

	bot._client.on('custom_payload', data => {
		if (data.channel !== mysteryMod.packetChannelName) return
		const buf = data.data
		const bufString = buf.toString()
		const eventEndIndex = buf[0] + 1
		const eventName = bufString.substring(1, eventEndIndex)
		const eventData = bufString.substring(eventEndIndex + 1, eventEndIndex + buf[eventEndIndex] + 1)

		if (eventName === 'user_subtitle') {
			try {
				JSON.parse(eventData)
			} catch (e) {
				console.log('subtitle parsing failed!')
				console.log('eventData: ' + eventData)
				console.log('eventDataLen: ' + eventData.length)
				console.log('bufString: ' + bufString)
				console.log('buf: ' + buf)
			}
			return // TODO: remove
		}
		bot.emit('misc:mysteryMod->' + eventName, JSON.parse(eventData))
	})
}
