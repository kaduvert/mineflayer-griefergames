module.exports = {
    chatPatterns: {
        flipWon: /^\[Coinflip\] Herzlichen Glückwunsch! Du hast die Summe von ([\d\.,]+)\$ auf ([\d\.,]+)\$ verdoppelt!$/,
        flipLost: /^\[Coinflip\] Du hast leider verloren und ([\d\.,]+)\$ verloren\.$/,
        help: /^\[Coinflip\] Verwendung \/coinflip <Betrag>$/,

        deactivatedError: /^\[Coinflip\] Coinflip ist deaktiviert\.$/,
        invalidNumberError: /^\[Coinflip\] Gib eine Zahl als Betrag an\.$/,
        insufficientBalanceError: /^\[Coinflip\] Du hast nicht genug Geld\.$/
    },
    commands: {
        play: '/coinflip $1'
    },
    chatActions: {
        play: {
            successEvents: ['flipWon', 'flipLost'],
            failureEvents: ['deactivatedError', 'invalidNumberError', 'insufficientBalanceError']
        }
    }
}
