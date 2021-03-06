"use strict";
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { do_db_setup, close_db } = require('./database/db_setup');
const apiRouter = require('./routes/apiRouter');
const path = require('path')
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const { logError, isOperationalError } = require('./errors/errorHandler')

do_db_setup()
const app = express()
const port = process.env.PORT || 8080


app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))
app.use(expressCspHeader({
    directives: {
        'img-src': ['*', 'data:'],
        'media-src': ['*', 'data:'],
    }
}))

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.use('/home/', express.static(path.join(__dirname, '../front_page')));
app.get('/home/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front_page', 'index.html'));
});
app.get('/join/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front_page', 'form.html'));
})


app.use('/app/', express.static(path.join(__dirname, '../client/build')));
app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.use('/api/', apiRouter)

process.on('unhandledRejection', err => {
    throw err
})
process.on('uncaughtException', err => {
    logError(err)
    if (!isOperationalError(err)) {
        console.log(err)
        process.exit(1)
    }
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})