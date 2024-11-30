
module.exports = {
    chatPatterns: {
        win: /^Herzlichen Glückwunsch! Du hast die Summe von (\d+)\$ auf (\d+)\$ verdoppelt!\.$/,
        loss: /^\Du hast leider verloren und (\d+)\$ verloren.\.$/,
        help: /^Verwendung \/coinflip <Betrag>\.$/,

        invalidNumberError: /^Gib eine Zahl als Betrag an.\.$/,
        insufficientAmountError: /^Du hast nicht genug Geld.\.$/
    },
    commands: {
        play: '/coinflip $1'
    },
    chatActions: {
        play: {
            successEvent: 'win',
            failureEvents: ['invalidNumberError', 'insufficientAmountError', 'loss']
        }
    }
}