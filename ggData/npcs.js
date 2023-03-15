module.exports = {

    /*
     * Stadt NPC's
     */

    "orbBuyer": {
        "name": "orbBuyer",
        "identifier": "Händler",
        "position": [172, 25, -42],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Händler$/,
    },
    "orbStuffSeller": {
        "name": "orbStuffSeller",
        "identifier": "Verkäufer",
        "position": [172, 25, -31],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Verkäufer$/,
    },
    "orbStats": {
        "name": "orbStats",
        "identifier": "Statistik",
        "position": [140, 25, -39],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Statistik von (\S+)$/,
    },
    "adventurer": {
        "name": "adventurer",
        "identifier": "Adventurer",
        "position": [145, 24, 3],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Adventure-Jobs$/,
    },
    "adventurerShop": {
        "name": "adventurerShop",
        "identifier": "Admin-Shop",
        "position": [147, 24, 1],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Shop$/,
    },
    "vote": {
        "name": "vote",
        "identifier": "Vote-System",
        "position": [129, 25, -18],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Vote-System$/,
    },
    "lottery": {
        "name": "lottery",
        "identifier": "Lotterie",
        "position": [139, 25, -30],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Lotterie$/,
    },
    "edgeBlacksmith": {
        "name": "edgeBlacksmith",
        "identifier": "Rand-Schmied",
        "position": [140, 25, -54],
        "world": "stadt",
        "onInteract": "windowOpen",
        "titleRegex": /^Rand-Konfigurator$/,
    },

    /*
     * Spawn NPC's
     */

    "adventurer2": {
        "name": "adventurer2",
        "identifier": "Adventurer",
        "position": [202, 64, 387],
        "world": "spawn",
        "onInteract": "windowOpen",
        "titleRegex": /^Adventure-Jobs$/,
    },
    "adventurerShop2": {
        "name": "adventurerShop2",
        "identifier": "Admin-Shop",
        "position": [200, 64, 387],
        "world": "spawn",
        "onInteract": "windowOpen",
        "titleRegex": /^Shop$/,
    },

    /*
     * Hub NPC's
     */

    "skyblock": {
        "name": "skyblock",
        "identifier": "Skyblock Museum",
        "onInteract": "teleport",
        "position": [42, 68, -182],
        "world": "hub"
    },
    "CB1.19": {
        "name": "CB1.19",
        "identifier": "Citybuild 1.19",
        "onInteract": "teleport",
        "position": [20, 71, -170],
        "world": "hub"
    },
    "CB1.8": {
        "name": "CB1.8",
        "identifier": "Citybuild 1.8",
        "onInteract": "teleport",
        "position": [16, 71, -170],
        "world": "hub"
    },
    "impressum": {
        "name": "impressum",
        "identifier": "Impressum",
        "onInteract": "chat",
        "position": [6, 71, -167],
        "world": "hub"
    },
    "privacyPolicy": {
        "name": "privacyPolicy",
        "identifier": "Datenschutz",
        "onInteract": "chat",
        "position": [2, 71, -171],
        "world": "hub"
    }
}