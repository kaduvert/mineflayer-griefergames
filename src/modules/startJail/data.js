const COMMAND_PREFIX = '/startjail '

module.exports = {
    chatPatterns: {
        purchaseSuccess: /^\[StartJail\] Du hast erfolgreich einen Gefängnis-Token gekauft\.$/,
        purchaseCancelled: /^\[StartJail\] Die Transaktion wurde abgebrochen\.$/,

        help: /^\[StartJail\] Verwende: \/startjail \<Spieler\> \<Grund\>\. $/,

        cooldownError: /^\[StartJail\] Bitte warte bis zum ([\d\.]+) ([\d:]+), um wieder eine Abstimmung zu starten\.$/,
        insufficientBalanceError: /^\[StartJail\] Dein Guthaben reicht leider nicht aus\.$/,
        noTokensError: /^\[StartJail\] Du hast keine Tokens mehr übrig\.$/
    },
    commands: {
        help: COMMAND_PREFIX,
        openMenu: COMMAND_PREFIX + 'buy',
        target: COMMAND_PREFIX + '$1 $2'
    },
    itemPatterns: {
        purchaseToken: {
            display: [
                /^Gefängins-Token kaufen$/,
                /^Klicke, um einen Token für (\d+)\$ zu kaufen\.$/
            ]
        },
        tokenBalance: {
            display: [
                /^Anzahl der Gefängnis-Tokens$/,
                /^Gefängnis-Tokens: (\d+)$/
            ]
        },
        confirmPurchase: {
            display: [
                /^Ja\.$/,
                /^Klicke, um den Kauf zu bestätigen\.$/
            ]
        },
        cancelPurchase: {
            display: [
                /^Nein\.$/,
                /^Klicke, um den Kauf abzubrechen\.$/
            ]
        },
    },
    windows: {
        menu: {
            titlePattern: /^Gefängnis-Token$/,
            requiredSlots: 0,
            actions: {
                startTokenPurchase: {
                    itemToClick: 'purchaseToken',
                    successEvent: 'windowOpen:confirmPurchase'
                }
            },
            getters: {
                tokenBalance: {
                    // ?: [1, 0]
                }
            }
        },
        confirmPurchase: {
            titlePattern: /^Kaufbestätigung$/,
            requiredSlots: 0,
            actions: {
                confirmTokenPurchase: {
                    itemToClick: 'confirmPurchase',
                    successEvent: 'purchaseSuccess',
                    failureEvent: 'insufficientBalanceError'
                },
                cancelTokenPurchase: {
                    itemToClick: 'cancelPurchase',
                    successEvent: 'purchaseCancelled',
                }
            }
        }
    },
    chatActions: {
        target: {
            successEvent: 'misc:startJail:$1',
            failureEvents: ['help', 'noTokensError']
        },
        openMenu: {
            successEvent: 'windowOpen:menu'
        }
    }
}
