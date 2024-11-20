module.exports = {
    chatPatterns: {
        ticketPurchaseSuccess: /^$GG Du hast erfolgreich ein Los erworben\.$/,
        payout: /^$GG Du hast ([\d\.]+)\$ erhalten\.$/,

        noPayoutsError: /^$GG Es sind keine Gewinne verfügbar\.$/,
    },
    windowPatterns: {
        menu: /^Lotterie$/,
    },
    npc: {
        identifier: 'Lotterie',
        position: [139, 25, -30],
        world: 'stadt',
        onInteract: 'windowOpen:lottery->menu',
    }
}

/*
[GrieferGames] Ihr habt noch 2 Stunden Zeit, um an der dieswöchigen Lotterie teilzunehmen.
[GrieferGames] Gewinn-Pool Silber-Stufe: 1.043.000
[GrieferGames] Gewinn-Pool Gold-Stufe: 5.094.500
[GrieferGames] Gewinn-Pool Diamant-Stufe: 10.462.000
*/