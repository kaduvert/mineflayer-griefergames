module.exports = {
    chatPatterns: {

        alreadyOpenedError: /^$GG Der Spawner ist aktuell von (\S+) geöffnet\.$/,
        noOpenPermissionsError: /^$GG Du hast aktuell keinen Zugriff auf den Spawner\.$/,

        availableExperienceCollected: /^$GG Du hast (\d+) Erfahrungspunkte erhalten\.$/,

        noFreeInventorySpaceError: /^$GG Du hast keinen freien Platz im Inventar\.$/,
        /*
        spawnerPassiveModeActivated: /^$GG Der Passiv-Modus des Spawners wurde aktiviert\.$/,
        [GrieferGames] Der Passiv-Modus des Spawners wurde deaktiviert.
        [GrieferGames] Der Zugriff auf das Lager ist nun gesperrt.
        [GrieferGames] Der Zugriff auf das Lager ist nun freigegeben.
        [GrieferGames] Der Zugriff auf die Einstellungen wurde für vertraute Spieler aktiviert.
        [GrieferGames] Du musst einen Moment warten, bis du das wieder verwenden kannst.
        [GrieferGames] Der Zugriff auf die Einstellungen wurde für vertraute Spieler deaktiviert.
        [GrieferGames] Der Spawner ist nicht freigegeben.
        */
    },
    storageWindowTimeout: 30 * 1000,
    windows: {
        inactive: {
            titlePattern: /^Spawner - Aktivieren$/
        },
        storage: {
            titlePattern: /^Spawner - Lager$/
        },
        stats: {
            titlePattern: /^Spawner - Statistik$/
        },
    },
    itemPatterns: {
        // deactivated spawner stuff
        stats: {
            display: [
                /^(.+)$/,
                /^Klicke, um zur Statistik zu gelangen\.$/,
                /^Die Statistik aktualisiert sich nur einmal am Tag\.$/
            ]
        },
        activatePassiveMode: {
            display: [
                /^Passiv-Modus aktivieren$/,
                /^Klicke, um den passiven Modus zu aktivieren\.$/
            ]
        },

        // activated spawner stuff
        lockedSlot: {
            display: /^Upgrade-Stufe ([IVX]+)$/
        },
        availableExperience: {
            display: [
                /^Aktuelle Erfahrungspunkte$/,
                /^(\d+) Erfahrungspunkte$/
            ]
        },
        nextUpdate: {
            display: [
                /^Nächste Aktualisierung$/,
                /^([\d\.]+) ([\d:]+) Uhr$/
            ]
        },
        settings: {
            display: [
                /^Einstellungen$/,
                /^Klicke, um zu den Einstellungen zu kommen\.$/
            ]
        },

        // spawner menu stuff
        upgrade: {
            display: [
                /^(\S+)-Upgrade-Stufe ([IVX]+)$/,
                /^Erhöht (.+)$/
            ]
        },
        itemFilter: {
            display: [
                /^Schalte den Item-Filter frei,$/,
                /^um den Drop zu deaktivieren\.$/
            ]
        },
        filterUpgrade: {
            display: [
                /^Filter-Upgrade$/,
                /^Lässt Item-Drops \(de-\)aktivieren\.$/,
                /^Kosten: (.+)$/
            ]
        },
        back: {
            display: [
                /^Zurück$/,
                /^Klicke, um auf die vorherige Seite zu gelangen\.$/
            ]
        },
        deactivatePassiveMode: {
            display: [
                /^Passiv-Modus deaktivieren$/,
                /^Klicke, um den passiven Modus zu deaktivieren\.$/,
                /^Du kannst alle (\d+) Minuten den Modus ändern\.$/
            ]
        }
    }
}

/*
unnamedSlot: {
    titleRegex: /^Spawner nicht freigegeben$/,
        loreRegex: [
            /^Um den Spawner für andere freizugeben,$/,
            /^füge die Use-Flag 52 deinem Grundstück hinzu.$/
        ]
},
unnamedSlot: {
    titleRegex: /^Zugriff für Besitzer$/,
        loreRegex: [
            /^Klicke, um den Zugriff auf die Einstellungen zu beschränken.$/,
            /^Aktuell: Zugriff nur für Besitzer$/
        ]
}
*/