// load env
var path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname + '/../.env')
})

// import packages
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var compression = require('compression')
var cors = require('cors')
var helmet = require('helmet')
var morgan = require('morgan')

var app = express()

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// compress all responses
app.use(compression())

// cors
app.use(cors())

// helmet
app.use(helmet())

// morgan
app.use(morgan('dev'))

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something wrong!')
})

// basic auth middleware
const basicAuth = (req, res, next) => {
    const regexBasicAuth = /^Basic\s/
    let authorization = req.headers.authorization || ''
    let b64auth = authorization.match(regexBasicAuth) ? authorization.replace(regexBasicAuth, '') : ''
    if (b64auth) {
        let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':')
        if (username == process.env.APP_USERNAME && password == process.env.APP_PASSWORD) {
            return next()
        }
    }

    return res.status(401).send('Unauthorized')
}

// routes
var controllers = require('./controllers')
app.post('/api/login', controllers.login)
app.get('/api/urls', basicAuth, controllers.list)
app.post('/api/urls', basicAuth, controllers.store)
app.put('/api/urls/:id', basicAuth, controllers.update)
app.delete('/api/urls/:id', basicAuth, controllers.delete)

let uiPath = path.resolve(__dirname + '/../ui')
app.use('/static', express.static(uiPath + '/static'))
app.get(['/app', '/app/*'], (req, res) => res.sendFile(uiPath + '/app.html'))

app.get('/:short', controllers.visit)

// 404 handler
app.use((req, res, next) => {
    res.status(404).send(`Sorry can't find that!`)
})

// server
var server = http.createServer(app)
const port = 5000
server.listen(port, () => console.log(`App listening on port ${port}!`))
