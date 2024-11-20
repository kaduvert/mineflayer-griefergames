const { GoalNear } = require('mineflayer-pathfinder').goals
const v = require('vec3')

module.exports = function load(bot, ns) {
    ns.npc = {}

    ns.npc.travelNear = (npc, proximity = 3) => {
        const npcBlockPosition = v(npc.position).offset(0.5, 1, 0.5)
        return bot.pathfinder.goto(new GoalNear(npcBlockPosition.x, npcBlockPosition.y, npcBlockPosition.z, proximity))
    }

    ns.npc.find = (npc) => {
        const npcBlockPosition = v(npc.position).offset(0.5, 1, 0.5)
        return Object.values(bot.entities).find(entity => (entity.type === 'player' && entity.username.replace(/§./g, '') === npc.identifier && npcBlockPosition.xzDistanceTo(entity.position) <= 0.5))
    }

    ns.npc.getWindow = (npc, npcEntity) => {
        bot.activateEntity(npcEntity)
        return new Promise(res => {
            bot.once(npc.onInteract, res)
        })
    }
}
