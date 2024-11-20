module.exports = {
    chatPatterns: {
        startKick: [
            /^\[StartKick\] Achtung - StartKick-Abstimmung$/,
            /^\[StartKick\] Soll der Spieler (\S+) rausgeworfen werden\? \/ja \/nein$/,
            /^\[StartKick\] Ersteller: (\S+)$/,
            /^\[StartKick\] Dauer: (\d+) Sekunden$/,
            /^\[StartKick\] Begründung: (.*)$/,
            /^\[StartKick\] Stimme für oder gegen den Rauswurf von (\S+) ab:$/,
            /^$GG +\[Dafür\] - \[Dagegen\]$/
        ],
        startJail: [
            /^\[StartJail\] Achtung - StartJail-Abstimmung$/,
            /^\[StartJail\] Soll der Spieler (\S+) eingesperrt werden\? \/ja \/nein$/,
            /^\[StartJail\] Ersteller: (\S+)$/,
            /^\[StartJail\] Dauer: (\d+) Sekunden$/,
            /^\[StartJail\] Begründung: (.*)$/,
            /^\[StartJail\] Stimme für oder gegen die Bestrafung von (\S+) ab:$/,
            /^$GG +\[Dafür\] - \[Dagegen\]$/
        ],
        countdown: /^$GG Die Abstimmung, den Spieler (\S+) zu bestrafen, endet in (\d+) Sekunden!$/,
        result: [
            /^$GG Die Abstimmung, ging (\d+) zu (\d+) aus!$/,
            /^$GG (\S+) wurde (.+)$/
        ],
        vote: /^$GG Du hast für (Ja|Nein) gestimmt[!\.]$/,
        changeOpinionError: /^$GG Du kannst deine Stimme nur einmal ändern\.$/,
        noPollError: /^$GG Es läuft derzeit keine Abstimmung\.$/
    },
    commands: {
        voteYes: '/ja',
        voteNo: '/nein'
    },
    chatActions: {
        voteYes: {
            successEvent: 'vote',
            failureEvent: ['changeOpinionError', 'noPollError']
        },
        voteNo: {
            successEvent: 'vote',
            failureEvent: ['changeOpinionError', 'noPollError']
        }
    }
}
/*

[StartJail] Achtung - StartJail-Abstimmung
[StartJail] Soll der Spieler Spieler1 eingesperrt werden? /ja /nein
[StartJail] Ersteller: Spieler0
[StartJail] Dauer: 30 Sekunden
[StartJail] Begründung: scammer 
[StartJail] Stimme für oder gegen die Bestrafung von Spieler1 ab:
[GrieferGames]  [Dafür] - [Dagegen]

[GrieferGames] Die Abstimmung, den Spieler Spieler1 zu bestrafen, endet in 3 Sekunden!
[GrieferGames] Die Abstimmung, den Spieler Spieler1 zu bestrafen, endet in 2 Sekunden!
[GrieferGames] Die Abstimmung, den Spieler Spieler1 zu bestrafen, endet in 1 Sekunden!
Spieler1, Spieler2.
Spieler3.
[GrieferGames] Die Abstimmung Spieler1 ging 22 zu 1 aus!
[GrieferGames] Spieler1 wurde bestraft!
*/