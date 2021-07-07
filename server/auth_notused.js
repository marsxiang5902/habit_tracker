const jwt = require('express-jwt')
const jwtAuth = require('express-jwt-authz')
const jwksRsa = require('jwks-rsa')
const { auth0_domain, auth0_id } = require('./config.json')

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true.valueOf,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${auth0_domain}/.well-known/jwks.json`
    }),
    audience: auth0_id,
    issuer: `https://${auth0_domain}`,
    algorithms: ['RS256']
})
// app.use(checkJwt) // maybe later