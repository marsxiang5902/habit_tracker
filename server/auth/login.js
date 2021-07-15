'use strict'

const argon2 = require('argon2')
const exp_jwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const { jwt_secret, jwt_alg } = require('../config.json')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { get_users_col } = require('../database/db_setup')

async function login(user, password) {
    if (typeof user !== 'string' || typeof password !== 'string') {
        throw new httpStatusErrors.BAD_REQUEST(`Invalid data.`)
    }
    let users_col = get_users_col()
    let userRecord = await users_col.findOne({ user: user })
    if (!userRecord) {
        throw new httpStatusErrors.UNAUTHORIZED(`Incorrect username or password.`)
    }
    if (await argon2.verify(userRecord.auth.password_hashed, password)) {
        return generateJWT({ user: userRecord.user, roles: userRecord.roles })
    } else {
        throw new httpStatusErrors.UNAUTHORIZED(`Incorrect username or password.`)
    }
}

function generateJWT(data, exp = 3600) {
    return jwt.sign(data, jwt_secret, { algorithm: jwt_alg, expiresIn: exp })
}

module.exports = { login, generateJWT }