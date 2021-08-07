/*
    for each event:
        add activationDaysBit, activationTime, nextEvent
*/


const { do_db_setup, get_events_col } = require('../database/db_setup')
const { updateEvent } = require('../database/interactEvent');

(async () => {
    await do_db_setup()
    let events_col = get_events_col()
    let eventsCursor = await events_col.find({})
    let eventsAr = await eventsCursor.toArray()
    for (let i = 0; i < eventsAr.length; i++) {
        let record = eventsAr[i]
        await updateEvent(record._id, record, {
            activationDaysBit: 0, activationTime: 0, nextEvent: null
        })
    }
    console.log('done')
})()