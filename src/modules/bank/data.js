const COMMAND_PREFIX = '/bank '

module.exports = {
    chatPatterns: {
        balance: /^\[Bank\] Kontostand: (\d+)$/,
        deposit: /^\[Bank\] Du hast (\d+) auf dein Bankkonto eingezahlt\.$/,
        withdrawl: /^\[Bank\] Du hast (\d+) von deinem Bankkonto abgehoben\.$/,
        help: /^\[Bank\] Die Bank sichert dein Geld vor Verlust durch Serverfehler oder einem Reset\.$/,

        invalidNumberError: /^\[Bank\] (.+) ist keine gültige Zahl\.$/,
        insufficientAmountError: /^\[Bank\] Du hast nicht genug Guthaben oder willst einen zu geringen Betrag abheben\. Der Mindestein- und Auszahlungsbetrag liegt bei (.+)\$\.$/,
        spamWarning: /^\[Bank\] Du kannst diesen Befehl nur alle (\d+) Sekunden benutzen\.$/,
    },
    commands: {
        getBalance: COMMAND_PREFIX + 'guthaben',
        deposit: COMMAND_PREFIX + 'einzahlen $1',
        withdraw: COMMAND_PREFIX + 'abheben $1'
    },
    chatActions: {
        getBalance: {
            successEvent: 'balance'
        },
        deposit: {
            successEvent: 'deposit',
            failureEvents: ['invalidNumberError', 'insufficientAmountError']
        },
        withdraw: {
            successEvent: 'withdrawl',
            failureEvents: ['invalidNumberError', 'insufficientAmountError']
        }
    }
}
