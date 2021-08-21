/*
    add form, change history to checkedHistory
*/


const { do_db_setup, get_events_col, get_users_col } = require('../database/db_setup');

(async () => {
    await do_db_setup()
    get_events_col().updateMany({}, { "$rename": { historyManager: 'checkedHistory' } })
    get_users_col().updateMany({}, { "$set": { "eventLists.form": [] } })
    console.log('done')
})()