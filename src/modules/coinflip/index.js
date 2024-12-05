module.exports = function load(bot, ns) {
    const coinflip = ns['coinflip'].data

    ns.coinflip.flip = async (amount) => {
        const result = await ns.coinflip.play(amount)

        if (result.hasSucceeded()) {
            return {
                win: result.event.endsWith('flipWon'),
                amount: ns.money.toNumberScoreboard(result.eventArgs[0][win ? 1 : 0], false)
            }
        } else {
            return new Error(result.event)
        }
    }
}
