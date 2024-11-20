module.exports = {
    chatPatterns: {
        presentCollected: /^$GG Du hast deine Geschenke abgeholt\.$/,
        noPresentsError: /^$GG Du kannst keine weiteren Geschenke abholen\.$/,
    },
    commands: {
        getInfo: '/vote',
        collectPresent: '/geschenk'
    },
    chatActions: {
        collectPresent: {
            successEvent: 'presentCollected',
            failureEvent: 'noPresents'
        }
    },
    windowPatterns: {
        streakMenu: /^Vote-System$/
    },
    npc: {
        identifier: 'Vote-System',
        position: [129, 25, -18],
        world: 'stadt',
        onInteract: 'windowOpen:vote->streakMenu'
    }
}
