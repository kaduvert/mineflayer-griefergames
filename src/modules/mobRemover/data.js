module.exports = {
    chatPatterns: {
        nextIn: /^\[MobRemover\] Achtung! In (\d+) Minuten? werden alle Tiere gelöscht\.$/,
        removedMobs: /^\[MobRemover\] Es wurden (\d+) Tiere entfernt\.$/,
    },
    cycleTime: 20 * 60 * 1000
}
