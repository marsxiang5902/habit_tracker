"use strict";

const { MongoClient } = require("mongodb");
const { username, password, cluster, db_name } = require('./database/dbconfig.json');

const uri = `mongodb+srv://${username}:${password}@${cluster}.2kphp.mongodb.net/${db_name}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(() => {
    const db = client.db(db_name)
})
console.log((client.isConnected()))