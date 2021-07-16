'use strict'

const argon2 = require('argon2')
const exp_jwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const { jwt_secret, jwt_alg } = require('../config.json')
const httpAssert = require('../errors/httpAssert')
const { get_users_col } = require('../database/db_setup')
const { ALL_ROLES } = require('../permissions/roles')

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
    httpAssert.BAD_REQUEST(typeof user == 'string' || typeof password == 'string', `Invalid data.`)
    let users_col = get_users_col()
    let userRecord = await users_col.findOne({ user: user })
    httpAssert.UNAUTHORIZED(userRecord, `Invalid data.`)
    httpAssert.UNAUTHORIZED(await argon2.verify(userRecord.auth.password_hashed, password),
        `Incorrect username or password.`)

    return generateJWT({ user: userRecord.user, perms: Array.from(getPerms(userRecord.roles)) })
}

function generateJWT(data, exp = 3600) {
    return jwt.sign(data, jwt_secret, { algorithm: jwt_alg, expiresIn: exp })
}

module.exports = { login, generateJWT }