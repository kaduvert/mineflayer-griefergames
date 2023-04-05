module.exports = function inject(bot, options) {
	const mapInfo = bot.hostData['mapInfo']

	bot.mapInfo.parse = (regexMatches) => {
		const [mapId, serverId, dynamicId, server, world, creator, width, height, scale, originalId, dataSize, firstBytesCount, firstBytes] = regexMatches
		return {
			mapId,
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
}
