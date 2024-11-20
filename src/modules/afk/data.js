module.exports = {
    itemPatterns: {
        solveChallange: {
            display: /^Ich bin nicht AFK!$/
        }
    },
    chatPatterns: {
        challangeSolved: /^Du wurdest als AFK erkannt und bist rechtzeitig zurückgekehrt\. Bewege dich mehr, um die Erkennung aufzuheben\.$/
    },
    windows: {
        challange: {
            titlePattern: /^Bist du AFK\?$/,
            requiredSlots: 9,
            actions: {
                solveChallange: {
                    successEvents: ['challangeSolved', 'windowClose'],
                }
            }
        }
    }
}
