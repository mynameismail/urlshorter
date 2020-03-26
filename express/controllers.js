var { Url } = require('./models')

let controllers = {}

controllers.login = (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (username == process.env.APP_USERNAME && password == process.env.APP_PASSWORD) {
    return res.status(200).send('Correct login')
  }
  
  return res.status(401).send('Wrong login')
}

controllers.list = (req, res) => {
  Url.findAll()
  .then(urls => {
    return res.status(200).send({
      data: urls,
      message: 'Success'
    })
  })
  .catch(() => res.status(500).send('Error'))
}

controllers.store = (req, res) => {
  let name = req.body.name || 'New URL'
  let real_url = req.body.real_url
  if (!real_url) {
    return res.status(400).send('Bad request')
  }

  Url.create({
    name: name,
    real_url: real_url
  })
  .then(() => res.status(200).send('Success'))
  .catch(() => res.status(500).send('Error'))
}

controllers.update = (req, res) => {
  let id = req.params.id
  if (!parseInt(id)) {
    return res.status(400).send('Bad request')
  }
  Url.findOne({ where: { id: id } })
  .then(url => {
    if (url) {
      let name = req.body.name
      let real_url = req.body.real_url
      if (!real_url) {
        return res.status(400).send('Bad request')
      }
      url.name = name
      url.real_url = real_url
      url.save()
      .then(() => res.status(200).send('Success'))
    } else {
      return res.status(404).send('Not found')
    }
  })
  .catch(() => res.status(500).send('Error'))
}

controllers.delete = (req, res) => {
  let id = req.params.id
  if (!parseInt(id)) {
    return res.status(400).send('Bad request')
  }
  Url.findOne({ where: { id: id } })
  .then(url => {
    if (url) {
      url.destroy()
      .then(() => res.status(200).send('Success'))
    } else {
      return res.status(404).send('Not found')
    }
  })
  .catch(() => res.status(500).send('Error'))
}

controllers.visit = (req, res) => {
  let id = req.params.id
  if (!parseInt(id)) {
    return res.status(400).send('Bad request')
  }
  Url.findOne({ where: { id: id } })
  .then(url => {
    if (url) {
      url.visited = url.visited + 1
      url.save()
      return res.redirect(url.real_url)
    } else {
      return res.status(404).send('Not found')
    }
  })
  .catch(() => res.status(500).send('Error'))
}

module.exports = controllers
