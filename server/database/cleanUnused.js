const { get_events_col, get_users_col, get_triggers_col } = require("./db_setup")

function getUnused(all, used) {
    used = new Set(used.map(id => id.toString()))
    unused = []
    all.forEach(x => {
        if (!used.has(x.toString())) {
            unused.push(x)
        }
    })
    return unused
}
async function cleanEvents() {
    let allEvents = (await (await get_events_col().find({})).toArray()).map(
        eventRecord => eventRecord._id);
    let allUsers = (await (await get_users_col().find({})).toArray());
    let usedEvents = []
    allUsers.forEach(userRecord => {
        let lists = userRecord.eventLists
        for (let type in lists) {
            usedEvents = [...usedEvents, ...(lists[type])]
        }
    })
    let res = await get_events_col().deleteMany({ _id: { "$in": getUnused(allEvents, usedEvents) } })
    console.log(`Deleted ${res.result.n} events`)
}
async function cleanTriggers() {
    let allTriggers = (await (await get_triggers_col().find({})).toArray()).map(
        triggerRecord => triggerRecord._id);
    let allEvents = await (await get_events_col().find({})).toArray();
    let usedTriggers = []
    allEvents.forEach(eventRecord => {
        usedTriggers = [...usedTriggers, ...(eventRecord.triggerList)]
    })
    let res = await get_triggers_col().deleteMany({ _id: { "$in": getUnused(allTriggers, usedTriggers) } })
    console.log(`Deleted ${res.result.n} triggers`)
}
module.exports = {
    cleanEvents, cleanTriggers
}