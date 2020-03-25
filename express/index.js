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

// middlewares
const basicAuth = (req, res, next) => {
  const regexBasicAuth = /^Basic\s/
  let authorization = req.headers.authorization || ''
  let b64auth = authorization.match(regexBasicAuth) ? authorization.replace(regexBasicAuth, '') : ''
  if (b64auth) {
    let [user, pass] = Buffer.from(b64auth, 'base64').toString().split(':')
    if (user == process.env.APP_USER && pass == process.env.APP_PASS) {
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

app.get('/app*', (req, res) => res.sendFile(path.resolve(__dirname + '/app.html')))
app.get('/v/:id', controllers.visit)

// server
var server = http.createServer(app)
const port = 3000
server.listen(port, () => console.log(`App listening on port ${port}!`))
