const COMMAND_PREFIX = '/coinflip '

module.exports = {
    chatPatterns: {
        win: /^\[Coinflip\] Herzlichen Glückwunsch! Du hast die Summe von (\d+)\$ auf (\d+)\$ verdoppelt!\.$/,
        loss: /^\[Coinflip\] Du hast leider verloren und (\d+)\$ verloren.\.$/,
        help: /^\[Coinflip\] Verwendung \/coinflip <Betrag>\.$/,

        invalidNumberError: /^\[Coinflip\] Gib eine Zahl als Betrag an.\.$/,
        insufficientAmountError: /^\[Coinflip\] Du hast nicht genug Geld.\.$/
    },
    commands: {
        play: COMMAND_PREFIX + '$1'
    },
    chatActions: {
        play: {
            successEvent: ['win', 'loss'],
            failureEvents: ['invalidNumberError', 'insufficientAmountError']
        }
    }
}