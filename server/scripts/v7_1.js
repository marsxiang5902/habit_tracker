/*
    give goals and todos bitmask historymanagers
*/

const { do_db_setup, get_events_col } = require('../database/db_setup')
const HistoryManagerBitmask = require('../HistoryManager/HistoryManagerBitmask');

try {
    (async () => {
        await do_db_setup()
        await get_events_col().updateMany({ "type": { "$in": ['goal', 'todo'] } }, {
            "$set": {
                checkedHistory: new HistoryManagerBitmask()
            }
        })

        console.log('done')
    })()
} catch (err) {
    console.log(err)
}