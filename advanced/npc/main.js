const EventEmitter = require('events')
const { GoalNear } = require('mineflayer-pathfinder').goals
const v = require('vec3')

module.exports = function inject(bot, options) {
    const ChatMessage = require('prismarine-chat')(bot.version)

    bot.npc = {
        events: new EventEmitter()
    }

    bot.npc.travelNear = (npc, proximity = 3) => {
        const npcBlockPosition = v(npc.position).offset(0.5, 1, 0.5)
        return bot.pathfinder.goto(new GoalNear(npcBlockPosition.x, npcBlockPosition.y, npcBlockPosition.z, proximity))
    }

    bot.npc.find = (npc) => {
        const npcBlockPosition = v(npc.position).offset(0.5, 1, 0.5)
        let npcEntity = null
        Object.values(bot.entities).forEach(entity => {
            if (entity.type === 'player' && entity.username.replace(/§./g, '') === npc.identifier && npcBlockPosition.xzDistanceTo(entity.position) <= 0.5) {
                npcEntity = entity
            }
        })
        return npcEntity
    }

    bot.npc.getWindow = (npc, npcEntity) => {
        bot.activateEntity(npcEntity)
        return new Promise((res) => {
            bot.npc.events.once(`${npc.name}WindowOpened`, res)
        })
    }

	bot.on('windowOpen', (window) => {
        title = ChatMessage.fromNotch(window.title).toString()
        Object.values(bot.ggData.npc).forEach(npc => {
            if (npc.onInteract === 'windowOpen' && title.match(npc.titleRegex)) {
				console.log(`${npc.name}WindowOpened`)
                bot.npc.events.emit(npc.name + 'WindowOpened', window)
            }
        })
    })
}
