module.exports = function inject(bot, options) {
    Object.keys(bot.hostData).forEach(hostDataObjName => {
        const hostDataObj = bot.hostData[hostDataObjName]
        bot.loadChatPatterns(hostDataObj.chatPatterns, hostDataObjName)
        bot.window.loadPatterns(hostDataObj.windowPatterns, hostDataObjName)
    })

	Object.keys(bot.hostData).forEach(hostDataKey => {
		const hostData = bot.hostData[hostDataKey]
		const chatActions = hostData.chatActions
		if (chatActions) {
			Object.keys(chatActions).forEach(chatActionName => {
				const chatAction = JSON.parse(JSON.stringify(chatActions[chatActionName]))
				bot[hostDataKey][chatActionName] = function (...args) {
					const resolvedCommand = hostData.commands[chatActionName]
					chatAction.message = bot.buildString(resolvedCommand ? resolvedCommand : chatAction.command, args)

					chatAction.patternHead = hostDataKey

					return bot.chat.sendFallible(chatAction)
				}
			})
		}
	})

    bot.on('windowOpen', (window) => {
        const title = bot.pattern.window.getTranslatedTitle(window)
        const windowPatterns = bot.pattern.window.patterns
        Object.keys(windowPatterns).forEach(windowPatternName => {
            const windowPattern = windowPatterns[windowPatternName]

            const windowTitleMatch = bot.pattern.window.match(title, windowPattern)
            if (windowTitleMatch) {
                bot.emit('windowOpen:' + windowPatternName, window, windowTitleMatch)

                const hostDataName = windowPatternName.split(bot.patternHeadNameSeparator)[0]
                const hostData = bot.hostData[hostDataName]
                const windows = hostData.windows
                const windowActions = windows[windowPatternName].actions
                if (windowActions) {
                    Object.keys(windowActions).forEach(windowActionName => {
                        const windowAction = JSON.parse(JSON.stringify(windowActions[windowActionName]))
                        window[windowActionName] = function(...args) {
                            if (bot.currentWindow !== window) throw new Error(`function ${windowActionName} called on closed window ${windowPatternName}`)
                            
                            windowAction.window = window
                            /*
                            if (!windowAction.command) windowAction.command = windowActionName
                            bot.
                            */

                            windowAction.slotToClick = bot.pattern.item.findMatchingIn(window, hostData.itemPatterns[windowAction.itemToClick ?? windowActionName]).slot
                            if (!windowAction.slotToClick) throw new Error('itemToClick not found in window ' + windowPatternName)

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
                            
                            windowAction.patternHead = hostDataName
                            return bot.window.clickFallible(windowAction)
                        }
                    })
                }
            }
        })
    })
}
