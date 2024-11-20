module.exports = {
    chatPatterns: {
        placeSuccess: /^\[Teleporter\] Der Teleporter wurde erfolgreich gesetzt\.$/,
        breakSuccess: /^\[Teleporter\] Du hast den Teleporter entfernt\.$/,

        teleportSuccess: /^\[Teleporter\] Du befindest dich nun bei Teleporter (.+)\.$/,
        noPreviousTeleporterError: /^\[Teleporter\] Es gibt keinen weiteren Teleporter vor diesem!$/,
        noFurtherTeleporterError: /^\[Teleporter\] Es gibt keinen weiteren Teleporter nach diesem!$/
    },
    commands: {
        // does nothing
        main: '/teleporter'
    },
    itemPatterns: {
        currentPosition: {
            display: [
                /^Aktuelle Position$/,
                /^Du befindest dich gerade bei (.+)\.$/
            ]
        },
        destination: {
            display: [
                /^(.+)$/
            ],
            name: 'skull'
        },
        settings: {
            display: [
                /^Einstellungen$/
            ]
        },
        public: {
            display: [
                /^Öffentlich$/,
                /^Alle können den Teleporter anwählen\.$/
            ]
        },
        private: {
            display: [
                /^Privat$/,
                /^Nur du kannst den Teleporter anwählen\.$/
            ]
        }
    },
    windows: {
        selectDestination: {
            titlePattern: /^GS-Teleporter$/,
            requiredSlots: 0,
            actions: {
                getSettings: {
                    itemToClick: 'settings',
                    successEvent: 'windowOpen:settings'
                }
            }
        },
        settings: {
            titlePattern: /^Teleporter-Einstellungen$/,
            requiredSlots: 0,
            actions: {
                makePublic: {
                    itemToClick: 'public'
                },
                makePrivate: {
                    itemToClick: 'private'
                },
            }
        }
    }
}
