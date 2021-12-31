/*
    
*/

const { do_db_setup, get_events_col, get_users_col, get_triggers_col, get_groups_col } =
    require('../database/db_setup')
const HistoryManagerFields = require('../HistoryManager/HistoryManagerFields');

try {
    (async () => {
        await do_db_setup()
        let oldUser = "", newUser = ""
        let users_col = await get_users_col(), events_col = await get_events_col(),
            triggers_col = await get_triggers_col(), groups_col = await get_groups_col()
        for (let col of [users_col, events_col, triggers_col, groups_col]) {
            await col.updateMany({ user: oldUser }, { "$set": { user: newUser } })
        }
        console.log('done')
    })()
} catch (err) {
    console.log(err)
}