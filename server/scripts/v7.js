/*
    for each event
        add attributes color, starred, points
    for each user
        add attributes groups, points history, notifications
        remove partner
*/

const { do_db_setup, get_events_col, get_users_col } = require('../database/db_setup')
const HistoryManagerFields = require('../HistoryManager/HistoryManagerFields');

try {
    (async () => {
        await do_db_setup()
        let users_col = await get_users_col(), events_col = await get_events_col()
        await events_col.updateMany({}, {
            "$set": {
                "color": 0, "starred": false, "points": 10
            }, "$unset": {
                "partner": ""
            }
        })
        await users_col.updateMany({}, {
            "$set": {
                "groups": [], "pointsHistory": new HistoryManagerFields(), "notificationHistory": []
            }
        })
        console.log('done')
    })()
} catch (err) {
    console.log(err)
}