'use strict'

const { do_db_setup, get_users_col, close_db } = require('./database/db_setup')

async function run() {
    await do_db_setup()
    let users_col = get_users_col()
    users_col.insertOne({ a: 3, b: () => { console.log(4); return 4; } })
    await close_db()
}
run()