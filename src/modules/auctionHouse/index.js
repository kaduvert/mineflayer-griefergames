module.exports = function load(bot, ns) {
    const Item = require('prismarine-item')(bot.version)

    const ah = ns['auctionHouse'].data

    ns.auctionHouse.createAuction = async (stack, startPrice = 0, time = 24, auctionHouseWindow, immediatePurchasePrice = null) => {
        if (!auctionHouseWindow) {
            auctionHouseWindow = (await bot.gg.auctionHouse.open()).getWindow()
            await bot.delay(350)
        }

        const myAhWindow = (await auctionHouseWindow.getMyAuctionsWindow()).getWindow()
        await bot.delay(500)
        let auctionCreationWindow = (await myAhWindow.getAuctionCreationWindow()).getWindow()

        await bot.delay(350)

        const targetStack = auctionCreationWindow.items().find(invStack => Item.equal(invStack, stack, true))
        await bot.window.clickFallible({
            window: auctionCreationWindow,
            slotToClick: targetStack.slot
        })

        const startPriceStack = bot.pattern.item.findMatching(auctionCreationWindow, ah.itemPatterns.setStartPrice)
        const setStartPrice = ns.money.toNumberScoreboard(bot.pattern.item.matchDisplay(startPriceStack, ah.itemPatterns.setStartPrice.display)[3][0], false)

        if (startPrice !== setStartPrice) {
            await bot.delay(350)
            await bot.window.clickFallible({
                window: auctionCreationWindow,
                slotToClick: startPriceStack.slot,
                successEvent: 'chat:auctionHouse->setStartPriceRequest'
            })

            auctionCreationWindow = (await bot.gg.auctionHouse.submitValue(String(startPrice))).getWindow()
        }

        const immediatePurchasePriceStack = bot.pattern.item.findMatching(auctionCreationWindow, ah.itemPatterns.setImmediatePurchasePrice)
        const setImmediatePurchasePrice = ns.money.toNumberScoreboard(bot.pattern.item.matchDisplay(immediatePurchasePriceStack, ah.itemPatterns.setImmediatePurchasePrice.display)[3][0], false)
        if (
            (immediatePurchasePrice !== setImmediatePurchasePrice) &&
            (immediatePurchasePrice !== null && setImmediatePurchasePrice !== 'deaktiviert')
        ) {
            await bot.delay(350)
            let value = (immediatePurchasePrice === null) ? 0 : immediatePurchasePrice

            await bot.window.clickFallible({
                window: auctionCreationWindow,
                slotToClick: immediatePurchasePriceStack.slot,
                successEvent: 'chat:auctionHouse->setImmediatePurchasePriceBidRequest'
            })

            auctionCreationWindow = (await bot.gg.auctionHouse.submitValue(String(value))).getWindow()
        }

        let timeStack = bot.pattern.item.findMatching(auctionCreationWindow, ah.itemPatterns.setTime)
        let setTime = +bot.pattern.item.matchDisplay(timeStack, ah.itemPatterns.setTime.display)[3][0]
        while (setTime !== time) {
            await bot.delay(350)
            await bot.window.clickFallible({
                window: auctionCreationWindow,
                slotToClick: timeStack.slot,
                successEvent: 'chat:auctionHouse->changedAuctionTime'
            })

            timeStack = bot.pattern.item.findMatching(auctionCreationWindow, ah.itemPatterns.setTime)
            setTime = +bot.pattern.item.matchDisplay(timeStack, ah.itemPatterns.setTime.display)[3][0]
        }
        await bot.delay(500)

        const confirmationWindow = (await bot.currentWindow.createAuction()).getWindow()
        await bot.delay(350)
        await confirmationWindow.confirm()
    }

    const auctionPattern = ah.itemPatterns.auction
    ns.auctionHouse.getAuction = (activeAuctionStack) => {
        const stack = new Item(activeAuctionStack.type, activeAuctionStack.count, activeAuctionStack.metadata, structuredClone(activeAuctionStack.nbt))
        const lore = stack.customLore.map(line => bot.pattern.clearColorCodes(line))

        const splitIndex = lore.findIndex((line, i) => (
            (!line) &&
            (lore[i + 1].match(auctionPattern.separator))
        ))
        let tmp = lore.splice(splitIndex)
        tmp = tmp.splice(2)
        const remainder = tmp.findIndex(line => (
            line.match(auctionPattern.openAuction)
        )) + 1 - tmp.length
        if (remainder) tmp.splice(remainder)
        const auctionText = tmp

        const auctionedStack = new Item(stack.type, stack.count, stack.metadata, structuredClone(stack.nbt))
        auctionedStack.customLore = lore
        auctionedStack.slot = activeAuctionStack.slot

        const currentBidValueIndex = auctionText.findIndex((line, i) => {
            return (line.match(auctionPattern.currentBid[0]))
        })
        const currentBid = ns.money.toNumberScoreboard(bot.pattern.match(auctionText[currentBidValueIndex + 1], auctionPattern.currentBid[1])[0], false)

        const immediatePurchasePriceValueIndex = auctionText.findIndex((line, i) => {
            return (line.match(auctionPattern.immediatePurchasePrice[0]))
        })
        const immediatePurchasePrice = immediatePurchasePriceValueIndex === -1 ? null : ns.money.toNumberScoreboard(bot.pattern.match(auctionText[immediatePurchasePriceValueIndex + 1], auctionPattern.immediatePurchasePrice[1])[0], false)

        const remainingTimeValueIndex = auctionText.findIndex((line, i) => {
            return (line.match(auctionPattern.remainingTime[0]))
        })
        const remainingTime = bot.pattern.match(auctionText[remainingTimeValueIndex + 1], auctionPattern.remainingTime[1])[0]

        const highestBidder = Boolean(auctionText.find(line => line.match(auctionPattern.highestBidder)))

        return {
            stack: auctionedStack,
            currentBid,
            immediatePurchasePrice,
            remainingTime,
            highestBidder
        }
    }

    ns.auctionHouse.getAuctions = (auctionHouseWindow) => {
        return auctionHouseWindow.containerItems().filter(stack => {
            const slot = stack.slot + 1
            const rowIndex = ~~(slot / 9.001)
            const relativeRowIndex = (slot % 9)
            return (rowIndex > 0 && rowIndex < 5) && (relativeRowIndex > 1 && relativeRowIndex < 9) && stack.customLore
        }).map(ns.auctionHouse.getAuction)
    }

    ns.auctionHouse.getAuctionWindow = (auction, ahWindow) => {
        return bot.window.clickFallible({
            window: ahWindow,
            slotToClick: auction.stack.slot,
            successEvent: 'windowOpen:auctionHouse->auction'
        })
    }

    ns.auctionHouse.bid = async (amount, auctionWindow) => {
        await auctionWindow.bidCustom()
        const confirmWindow = (await ns.auctionHouse.submitValue(String(amount))).getWindow()
        await bot.delay(350)
        await confirmWindow.confirm()
    }

    ns.auctionHouse.bidLimit = async (amount, auctionWindow) => {
        await auctionWindow.bidLimitCustom()
        const confirmWindow = (await ns.auctionHouse.submitValue(String(amount))).getWindow()
        await bot.delay(350)
        await confirmWindow.confirm()
    }

    ns.auctionHouse.getMyBid = async (auctionWindow) => {
        const myBidStack = bot.pattern.item.findMatching(auctionWindow, ah.itemPatterns.myCurrentBid)
        return ns.money.toNumberScoreboard(bot.pattern.item.matchDisplay(myBidStack, ah.itemPatterns.myCurrentBid.display)[3][0], false)
    }
}
