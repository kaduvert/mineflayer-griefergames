// const EventEmitter = require('events')

module.exports = function inject(bot, options) {

	function isGoBackArrow(stack) {
		return (
			stack.name === 'skull' &&
			!!stack.customLore &&
			stack.customLore[0].replace(/§./g, '') === 'Klicke, um zur vorherigen Seite zurückzugelangen.'
		)
	}
	
	bot.npc.getPreviousWindow = (window) => {
		const goBackSlot = window.slots[window.inventoryStart - 9] // slot in lower left corner
		if (isGoBackArrow(stack)) {
			bot.clickWindow(goBackSlot.slot, 0, 0)
			return new Promise((res) => {
				bot.once('windowOpen', res)
			})
		} else {
			return null
		}
	}
}
