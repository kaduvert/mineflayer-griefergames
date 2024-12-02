module.exports = {
    /*
    chatPatterns: {
    },
    commands: {
        open: '/jobs',
        submitValue: '$1'
    },
    itemPatterns: {
        back: {
            display: [
                /^Zurück$/
            ]
        },
        nextPage: {
            display: [
                /^Nächste Seite$/,
                /^Klicke, um auf die nächste Seite zu gelangen\.$/,
            ]
        },
        previousPage: {
            display: [
                /^Vorherige Seite$/,
                /^Klicke, um auf die vorherige Seite zu gelangen\.$/,
            ]
        },
        filter: {
            display: [
                /^(Kein Filter|Filter: (.+)?)$/,
                /^Klicke ein Item in deinem Inventar an,$/,
                /^um nach diesem Item zu filtern$/,
                /^oder wechsel den Filter per Klick\.$/,
                /^ $/,
                /^Klicke, um den Filter zu wechseln\.$/
            ]
        },
        myJobs: { // TODO
            display: [
                /^Meine Auktionen$/,
                /^Hier kannst du deine Auktionen verwalten\.$/,
                /^ $/,
                /^Klicke, um deine Auktionen zu öffnen\.$/
            ]
        },

        createJob: { // TODO
            display: [
                /^Auktion erstellen$/,
                /^Erstelle eine neue Auktion\.$/,
                /^ $/,
                /^Klicke, um eine neue Auktion zu erstellen\.$/
            ]
        },

        setPrice: { // TODO
            display: [
                /^Startpreis festlegen$/,
                /^Bei diesem Preis startet die Auktion\.$/,
                /^ $/,
                /^Startpreis: ([\d\.]+)\$$/,
                /^ $/,
                /^Klicke, um den Startpreis zu ändern\.$/
            ]
        },
        setAmount: {
            display: [
                // TODO
            ]
        },

        confirmAction: {
            display: [
                /^Bestätigen$/,
                /^Klicke, um die Aktion zu bestätigen\.$/
            ]
        }
        // TODO: add filters
    },
    windows: {
        main: { // TODO
            titlePattern: /^Jobbörse$/,
            requiredSlots: 0,
            actions: {
                getMyAuctionsWindow: {
                    itemToClick: 'myAuctions',
                    successEvent: 'windowOpen:myAuctions'
                },
                getNextPage: {
                    itemToClick: 'nextPage',
                    // successEvent: 'TODO'
                },
                getPreviousPage: {
                    itemToClick: 'previousPage',
                    // successEvent: 'TODO'
                },
            },
        },
        myAuctions: { // TODO
            titlePattern: /^Meine Auktionen$/,
            requiredSlots: 0,
            actions: {
                getAuctionCreationWindow: {
                    itemToClick: 'createAuction',
                    successEvent: 'windowOpen:createAuction'
                }
            },
        },
        createAuction: { // TODO
            titlePattern: /^Auktion erstellen$/,
            requiredSlots: 0,
            actions: {
                setStartPrice: {
                    itemToClick: 'setStartPrice',
                    successEvent: 'setStartPriceRequest'
                },
                setImmediatePurchasePrice: {
                    itemToClick: 'setImmediatePurchasePrice',
                    successEvent: 'setImmediatePurchasePriceRequest'
                },
                setTime: {
                    itemToClick: 'setTime',
                    successEvent: 'changedAuctionTime'
                },
                createAuction: {
                    itemToClick: 'createAuctionWithValues',
                    successEvent: 'windowOpen:confirmAction'
                },
            },
        },
        confirmAction: {
            titlePattern: /^(.*)$/,
            requiredSlots: 45,
            actions: {
                confirm: {
                    itemToClick: 'confirmAction',
                    successEvent: 'windowClose',
                } // TODO: failure event
            },
        }
    },
    chatActions: {
        open: {
            successEvent: 'windowOpen:main'
        },
        submitValue: {
            successEvent: 'windowOpen'
        }
    }
    */
}
