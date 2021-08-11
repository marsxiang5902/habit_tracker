/*
    for each event:
        add activationDaysBit, activationTime, nextEvent
*/


const { do_db_setup, get_users_col } = require('../database/db_setup')

try {
    (async () => {
        await do_db_setup()
        await get_users_col().updateMany({}, { "$set": { email: '', dayStartTime: 0 } })
        console.log(done)
    })()
} catch (err) {
    console.log(err)
}