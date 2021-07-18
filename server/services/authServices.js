'use strict'

const { addUser } = require('../database/interactUser')
const httpAssert = require('../errors/httpAssert')
const { login: auth_login } = require('../auth/login')
const { get_users_col } = require('../database/db_setup')

async function login(user, password) {
    let data = await auth_login(user, password)
    return { jwt: data }
}
async function signup(user, password) {
    let userRecord = await (get_users_col().findOne({ user: user }))
    httpAssert.CONFLICT(!userRecord, `User ${user} already exists.`)
    await addUser(user, userRecord, password)
    return await login(user, password)
}
module.exports = {
    login, signup
}
signup