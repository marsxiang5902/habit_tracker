'use strict'

const argon2 = require('argon2')
const exp_jwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const { jwt_secret, jwt_alg } = require('../config.json')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { getUser } = require('../database/interactUser')

async function login(user, password) {
    if (typeof password !== 'string') {
        throw new httpStatusErrors.BAD_REQUEST(`Invalid data.`)
    }
    let userRecord = getUser(user)
    return (await argon2.verify(userRecord.password_hashed, password)) ? generateJWT({
        user: userRecord.user,
        roles: userRecord.roles
    }) : false
}

function generateJWT(data, exp = 3600) {
    return jwt.sign(data, jwt_secret, { algorithm: jwt_alg, exp: exp })
}

module.exports = { login, generateJWT }