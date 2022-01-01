/*
    give goals enddays and targets
*/

const { do_db_setup, get_events_col } = require('../database/db_setup')

try {
    (async () => {
        await do_db_setup()
        await get_events_col().updateMany({ "type": "goal" }, {
            "$set": {
                endDay: 1e9,
                goalTarget: { event_id: '', value: 0, formField: '' }
            }
        })

        console.log('done')
    })()
} catch (err) {
    console.log(err)
}