'use strict'

const { addUser, getUser } = require('../database/interactUser')
const httpAssert = require('../errors/httpAssert')
const { login: auth_login } = require('../auth/login')

async function login(user, password) {
    let data = await auth_login(user, password)
    return { jwt: data }
}
async function signup(user, password) {
    let userRecord = await getUser(user)
    httpAssert.CONFLICT(!userRecord, `User ${user} already exists.`)
    await addUser(user, userRecord, password)
    return await login(user, password)
}
module.exports = {
    login, signup
}