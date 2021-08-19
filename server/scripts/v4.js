/*
    for each event, if it is not a cue:
        add a triggerList

    for each event e, if it is a cue:
        t := trigger(e)
        add(t)

    for each user:
        delete user.eventLists.cue
    
    clean up unused events and triggers
*/


const { do_db_setup, get_events_col } = require('../database/db_setup')
const { cleanEvents } = require('../database/cleanUnused');

(async () => {
    await do_db_setup()
    get_events_col.update({}, { "$rename": { historyManager: 'checkedHistory' } })

    console.log('done')
})()