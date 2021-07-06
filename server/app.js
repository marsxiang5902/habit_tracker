"use strict";
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('express-jwt')
const jwtAuth = require('express-jwt-authz')
const jwksRsa = require('jwks-rsa')
const { auth0_domain, auth0_id } = require('./config.json')
const { do_db_setup, close_db } = require('./database/db_setup')
const interactUser = require('./database/interactUser')
const interactEvent = require('./database/interactEvent')

do_db_setup()
const app = express()
const port = process.env.PORT || 8080

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

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

app.get('/users/add/:user/', async (req, res) => {
    let result = await interactUser.addUser(req.params.user)
    res.send(`${result ? "added" : "did not add"} ${req.params.user}`)
})
app.get('/users/info/:user/', async (req, res) => {
    let result = await interactUser.getUserInfo(req.params.user)
    res.json(result)
})
app.get('/users/events/:user/', async (req, res) => {
    let result = await interactUser.getUserEvents(req.params.user)
    res.json(result)
})
app.get('/events/add/:user/:type/:name/', async (req, res) => {
    let result = await interactEvent.addEvent(req.params.user, req.params.name, req.params.type)
    res.send(result)
})


// admin?
app.all('/setup/', (req, res) => {
    do_db_setup();
    res.send('')
})
app.all('/close/', (req, res) => {
    close_db();
    res.send('')
})
app.all('/exit/', async (req, res) => {
    await close_db()
    res.send('')
    console.log('Exited')
    process.kill(process.pid, 'SIGTERM')
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})