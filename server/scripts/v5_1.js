/*
    give each user a goal eventList
*/
const { do_db_setup, get_users_col } = require('../database/db_setup');

(async () => {
    await do_db_setup()
    await get_users_col().updateMany({}, { "$set": { "eventLists.goal": [] } })
    console.log('done')
})()