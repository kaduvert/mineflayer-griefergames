module.exports = {
    chatPatterns: {
        failure: /^$GG Du konntest nicht teleportiert werden\.$/,
        spamWarning: /^Fehler: Zeit bis zur nächsten Teleportation: (now|\d+ Sekunden)$/,
        countdown: /^Teleportierungsvorgang startet in (\d+) Sekunden\. Bewege dich nicht\.$/,
    }
}
