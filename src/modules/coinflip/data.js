module.exports = {
    chatPatterns: {
        win: /^\[Coinflip\] Herzlichen Glückwunsch! Du hast die Summe von ([\d\.,]+)\$ auf ([\d\.,]+)\$ verdoppelt!$/,
        loss: /^\[Coinflip\] Du hast leider verloren und ([\d\.,]+)\$ verloren\.$/,
        help: /^\[Coinflip\] Verwendung \/coinflip <Betrag>$/,

        deactivatedError: /^\[Coinflip\] Coinflip ist deaktiviert\.$/,
        invalidNumberError: /^\[Coinflip\] Gib eine Zahl als Betrag an\.$/,
        insufficientAmountError: /^\[Coinflip\] Du hast nicht genug Geld\.$/
    },
    commands: {
        play: '/coinflip $1'
    },
    chatActions: {
        play: {
            successEvent: 'win',
            failureEvents: ['deactivatedError', 'invalidNumberError', 'insufficientAmountError', 'loss']
        }
    }
}
