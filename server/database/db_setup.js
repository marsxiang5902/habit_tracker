"use strict";
const { assert } = require("console");
const { MongoClient } = require("mongodb");
const { db_username, db_password, db_cluster, db_name } = require('../config.json');
const httpStatusErrors = require('../errors/httpStatusErrors')

const uri = `mongodb+srv://${db_username}:${db_password}@${db_cluster}.2kphp.mongodb.net/${db_name}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var users_col = null, events_col = null;

module.exports = {
    do_db_setup: async function do_db_setup() {
        if (!client.isConnected()) {
            await client.connect()
            let db = client.db(db_name)
            users_col = db.collection("users")
            events_col = db.collection("events")
            console.log("Connected to db")
        } else {
            assert(users_col !== null && events_col !== null)
        }
    },
    close_db: async function close_db() {
        if (client.isConnected()) {
            await client.close();
            users_col = null
            events_col = null
            console.log("Closed db")
        }
    },
    get_users_col: () => {
        if (users_col === null) {
            throw new httpStatusErrors.INTERNAL_SERVER(`Database error.`)
        }
        return users_col
    },
    get_events_col: () => {
        if (events_col === null) {
            throw new httpStatusErrors.INTERNAL_SERVER(`Database error.`)
        }
        return events_col
    },
}