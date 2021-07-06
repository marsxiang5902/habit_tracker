"use strict";
const { assert } = require("console");
const { MongoClient } = require("mongodb");
const { db_username, db_password, db_cluster, db_name } = require('../config.json');

const uri = `mongodb+srv://${db_username}:${db_password}@${db_cluster}.2kphp.mongodb.net/${db_name}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var users_col = null, events_col = null;

module.exports = {
    do_db_setup: function do_db_setup() {
        if (!client.isConnected()) {
            client.connect(err => {
                if (err) throw err;
                let db = client.db(db_name)
                users_col = db.collection("users")
                events_col = db.collection("events")
                console.log("Connected to db")
            })
        } else {
            assert(users_col !== null && events_col !== null)
        }
    },
    close_db: async function close_db() {
        if (client.isConnected()) {
            let err = await client.close();
            if (err) throw err;
            users_col = null
            events_col = null
            console.log("Closed db")
        }
    },
    get_users_col: () => { assert(users_col !== null); return users_col },
    get_events_col: () => { assert(events_col !== null); return events_col },
}