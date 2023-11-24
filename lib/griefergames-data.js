module.exports = function load(bot, ns) {
    function loadData(dataKey, data) {
        bot.loadChatPatterns(data.chatPatterns, dataKey)
        bot.window.loadPatterns(data, dataKey)

        const chatActions = data.chatActions
        if (chatActions) {
            Object.keys(chatActions).forEach(chatActionKey => {
                const chatAction = JSON.parse(JSON.stringify(chatActions[chatActionKey]))
                ns[dataKey][chatActionKey] = function (...args) {
                    const resolvedCommand = data.commands[chatActionKey]
                    chatAction.message = bot.buildString(resolvedCommand ? resolvedCommand : chatAction.command, args)

                    chatAction.patternHead = dataKey

                    return ns.chat.sendFallible(chatAction)
                }
            })
        }

        const windows = data.windows
        if (windows) {
            Object.values(windows).forEach(window => {
                const slotFormations = window.slotFormations
                if (slotFormations) {
                    Object.values(slotFormations).forEach(slotFormation => {
                        const surroundings = slotFormation.surroundings
                        if (surroundings) {
                            Object.keys(surroundings).forEach(surroundingLocation => {
                                const patternIdentifier = surroundings[surroundingLocation]
                                surroundings[surroundingLocation] = (/* windows.slotFormations[patternIdentifier] ?? */data.itemPatterns[patternIdentifier])
                            })
                        }
                    })
                }
            })
        }
    }

    Object.keys(ns.data).forEach(key => loadData(key, ns.data[key]))

    const getItem = (window, windowPattern, patternKey, data) => {
        const slotFormation = windowPattern.slotFormations?.[patternKey]
        if (slotFormation) {
            return window.slots.find(slot => bot.pattern.window.matchSlotFormation(window, slot, slotFormation))
        } else {
            return window.slots.find(slot => bot.pattern.item.match(slot, data.itemPatterns[patternKey]))
        }
    }

    const matchItem = (item, window, windowPattern, patternKey, data) => {
        const slotFormation = windowPattern.slotFormations?.[patternKey]
        if (slotFormation) {
            return bot.pattern.window.matchSlotFormation(window, slot, slotFormation)
        } else {
            return bot.pattern.item.match(item, data.itemPatterns[patternKey])
        }
    }

    bot.on('windowOpen', (window) => {
        const title = bot.pattern.window.getTranslatedTitle(window)
        const windowPatterns = bot.pattern.window.patterns
        Object.keys(windowPatterns).forEach(windowPatternKey => {
            const windowPattern = windowPatterns[windowPatternKey]

            const windowTitleMatch = bot.pattern.window.match(title, windowPattern)
            if (windowTitleMatch) {
                bot.emit('windowOpen:' + windowPatternKey, window, windowTitleMatch)

                const dataKey = windowPatternKey.split(bot.patternHeadNameSeparator)[0]
                const data = ns.data[dataKey]
                const windowPattern = data.windows[windowPatternKey.split(bot.patternHeadNameSeparator)[1]]
                const windowActions = windowPattern.actions
                if (windowActions) Object.keys(windowActions).forEach(windowActionKey => {
                    const windowAction = JSON.parse(JSON.stringify(windowActions[windowActionKey]))

                    window[windowActionKey] = function (...args) {
                        if (bot.currentWindow !== window) throw new Error(`function ${windowActionKey} called on closed window ${windowPatternKey}`)

                        windowAction.window = window
                        /*
                        if (!windowAction.command) windowAction.command = windowActionKey
                        bot.
                        */

                        windowAction.slotToClick = getItem(window, windowPattern, windowAction.itemToClick ?? windowActionKey, data)?.slot
                        if (!windowAction.slotToClick) throw new Error('itemToClick not found in window ' + windowPatternKey)

                        Object.keys(windowAction).forEach(windowActionKey => {
                            const windowActionValue = windowAction[windowActionKey]
                            const isArr = windowActionValue instanceof Array
                            const isStr = typeof windowActionValue === 'string'
                            if (isStr) {
                                windowAction[windowActionKey] = bot.buildString(windowActionValue, args)
                            } else if (isArr) {
                                windowActionValue.map(value => {
                                    if (typeof value === 'string') {
                                        return bot.buildString(value, args)
                                    }
                                    return value
                                })
                            }
                        })

                        windowAction.patternHead = dataKey
                        return bot.window.clickFallible(windowAction)
                    }
                })

                const windowGetters = windowPattern.getters
                if (windowGetters) Object.keys(windowGetters).forEach(windowGetterKey => {
                    const windowGetter = windowGetters[windowGetterKey]
                    const getterItemPatternKey = windowGetter.pattern ?? windowGetterKey
                    Object.assign(window, {
                        get [windowGetters]() {
                            const targetStack = getItem(window, windowPattern, getterItemPatternKey, data)
                            const stackMatch = matchItem(targetStack, window, windowPattern, getterItemPatternKey, data)

                            return stackMatch[windowGetter.indexLocation[0]][windowGetter.indexLocation[1]]
                        }
                    })
                })
            }
        })
    })
}
