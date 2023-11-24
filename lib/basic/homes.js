module.exports = function load(bot, ns) {
    const homes = ns.data['homes']

    ns.homes.parseList = (str) => {
        if (str === 'keine') return []
        return str.split(', ')
    }
}
