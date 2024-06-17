# mineflayer-griefergames
griefergames chat, window, hologram and npc interactions abstracted to a simple to use API located under bot.gg

##### Usage:
```js
let bot = mineflayer.createBot({
	username: '-',
	auth: 'microsoft',
	host: 'griefergames.net',
	port: 25565,
	version: '1.8.9'
})
bot.loadPlugin(require('mineflayer-griefergames'))

bot.once('misc:serverInfo->join', async () => {
    await bot.gg.switch.to('cb22')

    // chat sending api conforming to spam limits
    await bot.gg.chat.send('hallo, ich bins!')

    // msg sending
    await bot.gg.privateChat.send('AbgegrieftHD', 'Hi')

    // read plot info from plot the bot currently stands on
    console.log(await bot.gg.plot.fromPositionVarying().getInfo())

    // list your homes in array format
    const homes = await bot.gg.homes.get()

    // travel to a home
    await bot.gg.homes.teleportTo(homes[0])

    // get next item clear as JS Date
    bot.gg.itemClear.nextAt

    // pay money
    await bot.gg.money.transfer('AbgegrieftHD', 100)
})
```

##### docs?

there are no docs, for functions just debug the bot.gg object and figure out what you need through reading data & code

for events just look at the respective files here and in mineflayer-griefergames-data.
the common event format is:
`$(patternCategory):$(fileName)->$(patternKey)`

- patternCategory: one of chat, windowOpen, misc
  misc events are always emitted directly by code, if there is a misc version of an event, you probably want to use that, as it contains added logic that you'd want in most cases. this includes resolving nicknames, fake payment checks, aggregating messages, gathering additional data, calculations, parsing,  ...
- fileName: eg: money, tpa, homes, privateChat, plot
- patternKey: this is what the pattern is referenced as within the sorrounding patterns object
