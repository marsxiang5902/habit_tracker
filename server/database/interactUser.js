const { assert } = require('console')
const { get_users_col } = require('./db_setup')
const User = require('../Users/User')

module.exports = {
    addUser: function addUser(name) {
        let users_col = get_users_col()
        assert(users_col !== null)
        users_col.findOne({ name: name }, (err, res) => {
            if (err) throw err;
            if (!res) {
                let newUser = new User(name)
                users_col.insertOne(newUser, (err) => {
                    if (err) throw err;
                })
            }
        })
    },
    getUserInfo: function getUserInfo(name) {
        let users_col = get_users_col()
        assert(users_col !== null)
        return users_col.findOne({ name: name })
    }
}