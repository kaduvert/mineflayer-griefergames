const EventEmitter = require('events')
const { GoalNear } = require('mineflayer-pathfinder').goals
const v = require('vec3')

module.exports = function inject(bot, options) {
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
        return new Promise(res => {
            bot.once(npc.onInteract, res)
        })
    }
}
