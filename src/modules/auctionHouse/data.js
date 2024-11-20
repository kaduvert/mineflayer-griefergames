module.exports = {
    chatPatterns: {
        changedAuctionTime: /^$GG Die Laufzeit wurde auf ([\d]+) Stunden geändert\.$/,
        createdAuction: /^$GG Die Auktion für (.+) wurde erfolgreich erstellt\.$/,

        setStartPriceRequest: /^$GG Bitte gib den gewünschten Startpreis ein:$/,
        setImmediatePurchasePriceBidRequest: /^$GG Bitte gib den gewünschten Sofortkaufpreis ein: \(Mit 0 wird der Sofortkauf deaktiviert\)$/,

        submitBidRequest: /^$GG Bitte gib den gewünschten Betrag ein: \(Du musst den vollen Betrag eingeben\)$/,
        submitBidLimitRequest: /^$GG Bitte gib das gewünschte Gebotslimit ein: \(Du musst den vollen Betrag eingeben\)$/,
        bidSubmitted: /^$GG Dein Gebot wurde erfolgreich abgegeben\.$/,

        youWereOutbid: /^$GG Du wurdest bei der Auktion für (.+) überboten!$/
    },
    commands: {
        open: '/ah',
        submitValue: '$1'
    },
    itemPatterns: {
        auction: {
            seperator: /^░+$/,
            openAuction: /^Klicke, um die Auktion zu öffnen\.$/,
            currentBid: [
                /^\$ \| Aktuelles Gebot:$/,
                /^([\d\.]+)\$$/,
            ],
            immediatePurchasePrice: [
                /^\$ \| Sofortkauf:$/,
                /^([\d\.]+)\$$/,
            ],
            remainingTime: [
                /^. \| Verbleibende Zeit:$/,
                /^(.+)$/,
            ],
            highestBidder: /^. Du bist aktuell Höchstbietender!$/
            // TODO: add inactive auction lore
        },

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
        myWatchedAuctions: {
            display: [
                /^Meine beobachteten Auktionen$/,
                /^Hier kannst du deine beobachteten Auktionen verwalten\.$/,
                /^ $/,
                /^Klicke, um deine beobachteten Auktionen zu öffnen\.$/,
            ]
        },
        myAuctions: {
            display: [
                /^Meine Auktionen$/,
                /^Hier kannst du deine Auktionen verwalten\.$/,
                /^ $/,
                /^Klicke, um deine Auktionen zu öffnen\.$/
            ]
        },
        history: {
            display: [
                /^Auktionshistorie$/,
                /^Hier werden die abgelaufenen Auktionen der letzten$/,
                /^(\d+) Tage angezeigt\.$/,
                /^ $/,
                /^Klicke, um die Auktionshistorie zu öffnen\.$/
            ]
        },

        createAuction: {
            display: [
                /^Auktion erstellen$/,
                /^Erstelle eine neue Auktion\.$/,
                /^ $/,
                /^Klicke, um eine neue Auktion zu erstellen\.$/
            ]
        },
        // TODO: add filter for collectable auctions

        setStartPrice: {
            display: [
                /^Startpreis festlegen$/,
                /^Bei diesem Preis startet die Auktion\.$/,
                /^ $/,
                /^Startpreis: ([\d\.]+)\$$/,
                /^ $/,
                /^Klicke, um den Startpreis zu ändern\.$/
            ]
        },
        setImmediatePurchasePrice: {
            display: [
                /^Sofortkaufpreis festlegen$/,
                /^Bei diesem Preis kann das Item sofort gekauft werden\.$/,
                /^ $/,
                /^Sofortkaufpreis: (deaktiviert|[\d\.]+)\$$/,
                /^ $/,
                /^Klicke, um den Sofortkaufpreis zu ändern\.$/
            ]
        },
        setTime: {
            display: [
                /^Laufzeit festlegen$/,
                /^Wie lange soll die Auktion laufen\?$/,
                /^ $/,
                /^Laufzeit: ([\d]+) Stunden$/,
                /^ $/,
                /^Klicke, um die Laufzeit zu ändern\.$/
            ]
        },
        createAuctionWithValues: {
            display: [
                /^Auktion erstellen$/,
                /^Erstellt die Auktion mit den gewünschten Daten\.$/,
                /^ $/,
                /^Kosten: ([\d\.]+)\$$/,
                /^ $/,
                /^Klicke, um die Auktion zu erstellen\.$/
            ]
        },

        confirmAction: {
            display: [
                /^Bestätigen$/,
                /^Klicke, um die Aktion zu bestätigen\.$/
            ]
        },

        myCurrentBid: {
            display: [
                /^Mein Aktuelles Gebot$/,
                /^Das ist dein aktuelles Gebot\.$/,
                /^Gebot: ([\d\.]+)\$$/
            ]
        },
        fastBid: {
            display: [
                /^Schnellgebot ([\d\.]+)\$$/,
                /^Biete ([\d\.]+)\$ auf die Auktion\.$/,
                /^ $/,
                /^Klicke, um ([\d\.]+)\$ zu bieten\.$/
            ]
        },
        bidCustomAmount: {
            display: [
                /^Eigenen Betrag bieten$/,
                /^Gib einen eigenen Betrag ein, um zu bieten\.$/,
                /^ $/,
                /^Klicke, um den Betrag einzugeben\.$/
            ]
        },
        fastBidLimit: {
            display: [
                /^Gebotslimit ([\d\.]+)\$$/,
                /^Setzt dein Gebotslimit der Auktion auf ([\d\.]+)\$\.$/,
                /^ $/,
                /^Klicke, um ([\d\.]+)\$ zu setzen\.$/
            ]
        },
        customBidLimit: {
            display: [
                /^Eigenes Gebotslimit setzen$/,
                /^Gib ein eigenes Gebotslimit ein\.$/,
                /^ $/,
                /^Klicke, um das Gebotslimit einzugeben\.$/
            ]
        },
        bidImmediatePurchasePrice: {
            display: [
                /^Sofortkauf$/,
                /^Bietet direkt den Sofortkaufpreis von ([\d\.]+)\$\.$/,
                /^ $/,
                /^Klicke, um den Sofortkaufpreis zu bieten\.$/
            ]
        },

        // TODO: add filters
    },
    windows: {
        main: {
            titlePattern: /^Auktionshaus$/,
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
        myAuctions: {
            titlePattern: /^Meine Auktionen$/,
            requiredSlots: 0,
            actions: {
                getAuctionCreationWindow: {
                    itemToClick: 'createAuction',
                    successEvent: 'windowOpen:createAuction'
                }
            },
        },
        createAuction: {
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
        },
        auction: {
            titlePattern: /^Auktion$/,
            requiredSlots: 0,
            actions: {
                bidFast: {
                    itemToClick: 'fastBid',
                    successEvent: 'bidSubmitted'
                },
                bidCustom: {
                    itemToClick: 'bidCustomAmount',
                    successEvent: 'submitValue'
                },
                bidLimitFast: {
                    itemToClick: 'fastBidLimit',
                    successEvent: 'bidSubmitted'
                },
                bidLimitCustom: {
                    itemToClick: 'customBidLimit',
                    successEvent: 'submitValue'
                },
                bidImmediatePurchasePrice: {
                    itemToClick: 'bidImmediatePurchasePrice',
                    successEvent: 'bidSubmitted'
                }
            },
        },
    },
    chatActions: {
        open: {
            successEvent: 'windowOpen:main'
        },
        submitValue: {
            successEvent: 'windowOpen'
        }
    }
}
