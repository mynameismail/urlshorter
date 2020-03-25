var { Url } = require('./models')

let controllers = {}

controllers.login = (req, res) => {
  let user = req.body.user
  let pass = req.body.pass

  if (user == process.env.APP_USER && pass == process.env.APP_PASS) {
    return res.status(200).send('Correct login')
  } else {
    return res.status(401).send('Wrong login')
  }
}

controllers.list = (req, res) => {
  Url.findAll()
  .then(urls => {
    return res.status(200).send({
      data: urls,
      message: 'Success'
    })
  })
  .catch(err => res.status(500).send(err))
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
  .catch(err => res.status(500).send(err))
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
  .catch(err => res.status(500).send(err))
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
  .catch(err => res.status(500).send(err))
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
  .catch(err => res.status(500).send(err))
}

module.exports = controllers
