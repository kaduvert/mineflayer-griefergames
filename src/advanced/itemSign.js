module.exports = function load(bot, ns) {
    const itemSign = ns.data['itemSign']

    ns.itemSign.get = (stack) => {
        const lore = stack.customLore.map(line => line.replace(/§./g, ''))
        if (lore) {
            for (let i = lore.length - 1; i > 0; i--) {
                const footerLineMatch = lore[i].match(itemSign.signFooterRegex)
                if (footerLineMatch !== null) {
                    const [_, author, date] = footerLineMatch

                    let text = []
                    const coloredLore = stack.customLore
                    for (let j = 0; j < i; j++) {
                        if (lore[j]) text.push(coloredLore[j])
                    }

                    return {
                        text: text.join('\n'),
                        author,
                        date
                    }
                } else {
                    continue
                }
            }
        } else {
            return null
        }

        return null
    }
}
