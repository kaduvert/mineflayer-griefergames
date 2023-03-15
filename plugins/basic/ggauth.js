// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[GGAuth\] Deine Verifikation konnte nicht geprüft werden. Bitte verbinde dich mit dem Netzwerk erneut\.$/, 'ggauthVerificationError')
    bot.chatAddPattern(/^\[GGAuth\] Du musst dich zuerst verifizieren\.$/, 'ggauthVerificationError')

    bot.on('ggauthVerificationError', bot.quit)
}
