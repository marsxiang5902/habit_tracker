const express = require('express')
const app = express()
const port = 8080


const router = express.Router()

router.get('/', (req, res) => {

})

app.use('/', router)

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})