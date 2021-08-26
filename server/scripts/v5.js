/*
    each user has a partner
    each user can reset their days and query all events their partner did not do the previous day (!hm[1])

    lastLoginDay -> lastCheckedDay
*/
const { do_db_setup, get_users_col } = require('../database/db_setup');

(async () => {
    await do_db_setup()
    await get_users_col().updateMany({}, { "$set": { "partner": null } })
    console.log('done')
})()