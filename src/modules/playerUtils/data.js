module.exports = {
    chatPatterns: {
        playerNotFoundError: /^Fehler: Spieler nicht gefunden\.$/,
        /*
        playerNotFoundError: /^$GG Der Spieler \S+ wurde nicht gefunden\.$/,
        playerNotFoundError: /^$GG Der Spieler ist nicht online!$/,
        */
    },
    nicknamePrefix: '~',
    ranks: [
        'Spieler',
        'Premium',
        'Ultra',
        'Legende',
        'Titan',
        'Griefer',
        'Supreme',
        'Hero'
    ],
    commands: {
        getInventory: '/invsee $1',
        getEnderChest: '/ec $1',
        getMiscView: '/view $1'
    },
    windows: {
        inventory: {
            titlePattern: /^Inventory$/
        },
        enderChest: {
            titlePattern: /^Ender Chest$/
        },
        miscView: {
            titlePattern: /^Ansicht - (\S+)$/
        },
    },
    chatActions: {
        getInventory: {
            successEvent: 'windowOpen:inventory',
            failureEvent: 'playerNotFoundError'
        },
        getEnderChest: {
            successEvent: 'windowOpen:enderChest',
            failureEvent: 'playerNotFoundError'
        },
        getMiscView: {
            successEvent: 'windowOpen:miscView',
            failureEvent: 'playerNotFoundError'
        }
    }
}
