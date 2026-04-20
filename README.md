# mineflayer-griefergames

Implements GrieferGames-server specific functionality for smooth Bot Development.

Features include:

 - chat messages
 - ui windows
 - the portalroom
 - npcs
 - holograms
 - prefixes

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

# How to use

Create a basic setup like this:
```js
const mineflayer = require('mineflayer')

let bot = mineflayer.createBot({
	auth: 'microsoft',
	host: 'griefergames.net',
	port: 25565,
	version: '1.8.9'
})

bot.loadPlugin(require('mineflayer-griefergames'))
```

launch it in a debuggable environment like the VSCode Debugger or an interactive node terminal.
Now you can read the bot.gg object, which should contain everything you want.
I have not written documentation, as the debugging and code reading should be enough.
Also it's 2026, just ask AI to summarize

It is expected that you use common sense when interacting with mineflayer-griefergames, as it does not validate your input or reject faulty input, meaning that doing wrong things may not immediately become obvious.

GrieferGames events are emitted in this format:
```
(mineflayer-category):(griefergames-category)->(event-name)
```
mineflayer-category: one of `chat`, `windowOpen` or `misc`

griefergames-category: one of the folder names in the src/modules directory

event-name: either defined in the respective data.js file or emitted directly by code