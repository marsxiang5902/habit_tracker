/*
    move dayStartTime into preferences
    
*/
const { do_db_setup, get_users_col } = require('../database/db_setup');
const { updateUser } = require('../database/interactUser');

(async () => {
    await do_db_setup()
    let users_col = get_users_col()
    let usersCursor = await users_col.find({})
    let usersAr = await usersCursor.toArray()
    for (let i = 0; i < usersAr.length; i++) {
        let userRecord = usersAr[i]
        await users_col.updateOne({ user: userRecord.user }, {
            "$unset": { dayStartTime: "" }, "$set": {
                preferences: {
                    dayStartTime: userRecord.dayStartTime,
                    theme: "light",
                    defaultShowSidebar: true,
                    sidebarOrientation: "left"
                }
            }
        })
    }
    console.log('done')
})()