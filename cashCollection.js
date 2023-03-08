module.exports = function inject(bot, options) {
	bot._client.on('packet', (data, meta) => {
        if (meta.name !== 'custom_payload' || data.channel !== 'mysterymod:mm') return
        const check = Buffer.from(data.data).toString()
        if (!check.includes('mysterymod_user_check')) return
        bot._client.write('custom_payload', { channel: 'mysterymod:mm', data: Buffer.from(check.substring(check.indexOf('@'))) })
    })
}
