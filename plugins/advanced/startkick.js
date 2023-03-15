// const EventEmitter = require('events')

module.exports = function inject(bot, options) {
    bot.chatAddPattern(/^\[StartKick\] Soll der Spieler (\S+) rausgeworfen werden\? \/ja \/nein$/, 'startkickStart')
    bot.chatAddPattern(/^\[GrieferGames\]  \[Dafür\] - \[Dagegen\]$/, 'startkickEnd')
    bot.chatAddPattern(/^\[StartKick\] Ersteller: (\S+)$/, 'startkickCreator')
    bot.chatAddPattern(/^\[StartKick\] Dauer: (\S+) Sekunden$/, 'startkickDuration')
    bot.chatAddPattern(/^\[StartKick\] Begründung: (.*)$/, 'startkickReasoning')
    bot.chatAddPattern(/^\[StartKick\] Stimme für oder gegen den Rauswurf von (\S+) ab:$/, 'startkickTarget')

    const startkickReg = /^$/s

    bot.chatAddPattern(/^\[GrieferGames\] Die Abstimmung, den Spieler (\S+) zu bestrafen, endet in (\d+) Sekunden!$/, 'startkickCountdown')
    bot.chatAddPattern(/^\[GrieferGames\] Die Abstimmung, ging (\d+) zu (\d+) aus!$/, 'startkickVoting')
    bot.chatAddPattern(/^\[GrieferGames\] (\S+) wurde nicht bestraft$/, 'startkickResult')

	bot.startkick = {
        
    }

    
}