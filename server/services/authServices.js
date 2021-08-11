'use strict'

const { addUser, getUser, getUserByEmail } = require('../database/interactUser')
const { newDay } = require('./userServices')
const httpAssert = require('../errors/httpAssert')
const { login: auth_login } = require('../auth/login')

async function login(user, password) {
    let data = await auth_login(user, password)
    await newDay(user, await getUser(user))
    return { jwt: data }
}
async function signup(user, password, email) {
    let userRecord = await getUser(user)
    httpAssert.BAD_REQUEST(
        typeof user == 'string' && typeof password == 'string' && typeof email == 'string' &&
        user && password && email, `Data is invalid.`)
    httpAssert.CONFLICT(!userRecord, `User ${user} already exists.`)
    httpAssert.CONFLICT(!await getUserByEmail(email), `Email ${email} is taken.`)
    await addUser(user, userRecord, password, email)
    return await login(user, password)
}
module.exports = {
    login, signup
}