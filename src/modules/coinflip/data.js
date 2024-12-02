
module.exports = {
    chatPatterns: {
        win: /^\[Coinflip\] Herzlichen Glückwunsch! Du hast die Summe von (\d{1,3}(?:\.\d{3})*)\$ auf (\d{1,3}(?:\.\d{3})*)\$ verdoppelt!$/,
        loss: /^\[Coinflip\] Du hast leider verloren und (\d{1,3}(?:\.\d{3})*)\$ verloren\.$/,
        help: /^\[Coinflip\] Verwendung \/coinflip <Betrag>$/,

        invalidNumberError: /^\[Coinflip\] Gib eine Zahl als Betrag an\.$/,
        insufficientAmountError: /^\[Coinflip\] Du hast nicht genug Geld\.$/
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