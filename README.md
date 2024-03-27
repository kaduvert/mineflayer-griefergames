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

bot.gg.switch.to('cb22')

// chat sending api conforming to spam limits
bot.gg.chat.send('hallo, ich bins!')

// read plot info from plot the bot currently stands on
console.log(await bot.gg.plot.fromPositionVarying().getInfo())

// list your homes in array format
const homes = await bot.gg.homes.getList()

// travel to a home
bot.gg.homes.teleportTo(homes[0])

// get next item clear as unix milliseconds
bot.gg.itemClear.nextAt

// pay money
bot.gg.money.transfer('AbgegrieftHD', 100)

// for more documentation please just read the code

// please note: commands and window actions are auto-generated
// from the data alone, which means this repo creates only
// higher level functions which can not be auto-generated
```
