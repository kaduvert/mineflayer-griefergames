module.exports = function load(bot, ns) {
	const mapInfo = ns.data['mapInfo']

	ns.mapInfo.parse = (regexMatches) => {
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
