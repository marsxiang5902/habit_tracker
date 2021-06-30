const { MongoClient } = require("mongodb");
const { username, password, cluster, db_name } = require('./config.json');

const url = `mongodb+srv://${username}:${password}@${cluster}.2kphp.mongodb.net/${dbName}?retryWrites=true&w=majority`
const client = new MongoClient(url);

let users_col = null, events_col = null

module.exports = {
    do_db_setup: function do__db_setup() {
        client.connect().then(() => {
            console.log("Connected to db");
            const db = client.db(dbName);
            users_col = db.collection("users")
            events_col = db.collection("events")
            close = client.close
        })
    },
    close_db: function close_db() {
        client.close().then(() => {
            console.log("db closed")
        })
    },
    users_col: users_col, events_col: events_col
}