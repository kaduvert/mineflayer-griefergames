module.exports = {
    chatPatterns: {
        header: /^Folgende Booster sind auf diesem Server aktiv:$/,
        status: /^(\S+)-Booster: (.+)$/,
        activated: /^\[Booster\] \S+ ┃ (\S+) hat für die GrieferGames Community den (\S+)-Booster für (\d+) Minuten aktiviert\.$/,
        flyExpiredWarning: /^\[Booster\] Der Fly-Booster ist beendet\. Dein Flugmodus wird deaktiviert\.\.\.$/,
        deactivated: /^\[Booster\] Der (\S+)-Booster ist jetzt wieder deaktiviert\.$/,
        breakEffectRemoved: /^$GG Der Fast-Break-Effekt wurde entfernt\.$/,
    }
}

// [GrieferGames] Du hast nun wieder den Fast - Break - Effekt.