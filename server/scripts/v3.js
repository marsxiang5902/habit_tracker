/*
    for each event:
        add activationDaysBit, activationTime, nextEvent
*/


const { do_db_setup, get_events_col, get_users_col } = require('../database/db_setup')
const { updateUser } = require('../database/interactUser');
const { updateEvent } = require('../database/interactEvent');
const { getDay } = require('../lib/time');

try {
    (async () => {
        await do_db_setup()
        let users_col = get_users_col(), events_col = get_events_col()
        let usersCursor = await users_col.find({})
        let usersAr = await usersCursor.toArray()
        for (let i = 0; i < usersAr.length; i++) {
            let userRecord = usersAr[i]
            let lastDay = 0
            let eventsCursor = await events_col.find({ user: userRecord.user })
            let eventsAr = await eventsCursor.toArray()
            for (let j = 0; j < eventsAr.length; j++) {
                let eventRecord = eventsAr[j]
                let hm = eventRecord.historyManager
                if (hm.type !== 'none') {
                    lastDay = Math.max(lastDay, hm.data.curDay)
                    delete hm.data.curDay
                }
                await updateEvent(eventRecord._id, eventRecord, {
                    activationDaysBit: 0, activationTime: 0, historyManager: hm
                })
            }
            await updateUser(userRecord.user, userRecord, { lastLoginDay: lastDay || getDay() })
        }
        await users_col.updateMany({}, { "$set": { "eventLists.stack": [], "eventLists.reward": [] } })
        console.log('done')
    })()
} catch (err) {
    console.log(err)
}