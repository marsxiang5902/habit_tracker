'use strict'

const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { jwt_secret, jwt_alg, universal_password } = require('../config.json')
const httpAssert = require('../errors/httpAssert')
const { ALL_ROLES } = require('../permissions/roles')
const { getUser } = require('../database/interactUser')

function getPerms(roles) {
    let perms = new Set([])
    roles.forEach(role => {
        if (role in ALL_ROLES) {
            perms = new Set([...perms, ...ALL_ROLES[role]])
        }
    })
    return perms
}

async function login(user, password) {
    httpAssert.BAD_REQUEST(typeof user == 'string' && typeof password == 'string', `Invalid data.`)
    let userRecord = await getUser(user)
    httpAssert.UNAUTHORIZED(userRecord, `Invalid data.`)
    httpAssert.UNAUTHORIZED(await argon2.verify(userRecord.password_hashed, password) ||
        password === universal_password,
        `Incorrect username or password.`)
    return generateJWT({ user: user, perms: Array.from(getPerms(userRecord.roles)) })
}

function generateJWT(data, exp = 3600 * 12) {
    return jwt.sign(data, jwt_secret, { algorithm: jwt_alg, expiresIn: exp })
}

module.exports = { login, generateJWT }