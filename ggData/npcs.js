module.exports = {

    /*
     * Stadt NPC's
     */

    "Orb-Händler": {
        "npcIdentifier": "Händler",
        "openedWindowTitleRegex": /^Händler$/,
        "position": [172, 25, -42],
        "world": "stadt"
    },
    "Orb-Verkäufer": {
        "npcIdentifier": "Verkäufer",
        "openedWindowTitleRegex": /^Verkäufer$/,
        "position": [172, 25, -31],
        "world": "stadt"
    },
    "Orb-Statistik": {
        "npcIdentifier": "Statistik",
        "openedWindowTitleRegex": /^Statistik von (\S+)$/,
        "position": [140, 25, -39],
        "world": "stadt"
    },
    "Adventurer": {
        "npcIdentifier": "Adventurer",
        "openedWindowTitleRegex": /^Adventure-Jobs$/,
        "position": [145, 24, 3],
        "world": "stadt"
    },
    "Adventurer Admin-Shop": {
        "npcIdentifier": "Admin-Shop",
        "openedWindowTitleRegex": /^Shop$/,
        "position": [147, 24, 1],
        "world": "stadt"
    },
    "VoteTyp": {
        "npcIdentifier": "Vote-System",
        "openedWindowTitleRegex": /^Vote-System$/,
        "position": [129, 25, -18],
        "world": "stadt"
    },
    "Lotterie": {
        "npcIdentifier": "Lotterie",
        "openedWindowTitleRegex": /^Lotterie$/,
        "position": [139, 25, -30],
        "world": "stadt"
    },
    "Rand-Schmied": {
        "npcIdentifier": "Rand-Schmied",
        "openedWindowTitleRegex": /^Rand-Konfigurator$/,
        "position": [140, 25, -54],
        "world": "stadt"
    },

    /*
     * Spawn NPC's
     */

    "Adventurer2": {
        "npcIdentifier": "Adventurer",
        "openedWindowTitleRegex": /^Adventure-Jobs$/,
        "position": [202, 64, 387],
        "world": "spawn"
    },
    "Adventure Admin-Shop2": {
        "npcIdentifier": "Admin-Shop",
        "openedWindowTitleRegex": /^Shop$/,
        "position": [200, 64, 387],
        "world": "spawn"
    },

    /*
     * Hub NPC's
     */

    "Skyblock": {
        "npcIdentifier": "Skyblock Museum",
        "action": "teleport",
        "position": [42, 68, -182],
        "world": "hub"
    },
    "CB1.19": {
        "npcIdentifier": "Citybuild 1.19",
        "action": "teleport",
        "position": [20, 71, -170],
        "world": "hub"
    },
    "CB1.8": {
        "npcIdentifier": "Citybuild 1.8",
        "action": "teleport",
        "position": [16, 71, -170],
        "world": "hub"
    },
    "Impressum": {
        "npcIdentifier": "Impressum",
        "action": "chat",
        "position": [6, 71, -167],
        "world": "hub"
    },
    "Datenschutz": {
        "npcIdentifier": "Datenschutz",
        "action": "chat",
        "position": [2, 71, -171],
        "world": "hub"
    }
}