# mineflayer-griefergames
griefergames chat, window, hologram and npc interactions abstracted to a simple to use API located under bot.gg

##### Usage:
```js
let bot = mineflayer.createBot({
	username: loginMail,
	password: loginPW,
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
console.log(bot.gg.plot.fromPositionVarying().getInfo())

// list your homes in arrax format
const homes = bot.gg.homes.getList()

// travel to a home
bot.gg.homes.teleportTo(homes[0])

// get next item clear as a JS date
bot.gg.itemClear.nextAt

// pay money
bot.gg.money.transfer('AbgegrieftHD', 100)

// and much more...!
```
