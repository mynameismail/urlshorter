var { Url, idToShort, shortToId } = require('./models')

let controllers = {}

controllers.login = (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (username == process.env.APP_USERNAME && password == process.env.APP_PASSWORD) {
        return res.status(200).send('Correct login')
    }

    return res.status(401).send('Wrong login')
}

controllers.list = async (req, res) => {
    try {
        let urls = await Url.findAll()
        return res.status(200).send({
            data: urls,
            message: 'Success'
        })
    } catch (error) {
        console.log(error)
    }

    return res.status(500).send('Error')
}

controllers.store = async (req, res) => {
    let name = req.body.name || 'New URL'
    let real_url = req.body.real_url
    if (!real_url) {
        return res.status(400).send('Bad request')
    }

    try {
        let new_url = await Url.create({
            name: name,
            real_url: real_url
        })
        new_url.short_id = idToShort(new_url.id)
        let success = await new_url.save()
        if (success) {
            return res.status(200).send('Success')
        }
    } catch (error) {
        console.log(error)
    }

    return res.status(500).send('Error')
}

controllers.update = async (req, res) => {
    let id = req.params.id
    let name = req.body.name
    let real_url = req.body.real_url
    if (!parseInt(id) || !real_url) {
        return res.status(400).send('Bad request')
    }

    try {
        let url = await Url.findOne({ where: { id: id } })
        if (url) {
            url.name = name
            url.real_url = real_url
            let success = await url.save()
            if (success) {
                return res.status(200).send('Success')
            }
        } else {
            return res.status(404).send('Not found')
        }
    } catch (error) {
        console.log(error)
    }

    return res.status(500).send('Error')
}

controllers.delete = async (req, res) => {
    let id = req.params.id
    if (!parseInt(id)) {
        return res.status(400).send('Bad request')
    }

    try {
        let url = await Url.findOne({ where: { id: id } })
        if (url) {
            let success = await url.destroy()
            if (success) {
                return res.status(200).send('Success')
            }
        } else {
            return res.status(404).send('Not found')
        }
    } catch (error) {
        console.log(error)
    }

    return res.status(500).send('Error')
}

controllers.visit = async (req, res) => {
    try {
        let short = req.params.short
        let id = shortToId(short)
        let url = await Url.findOne({ where: { id: id } })
        if (url) {
            url.visited = url.visited + 1
            url.save()
            return res.redirect(url.real_url)
        } else {
            return res.status(404).send('Not found')
        }
    } catch (error) {
        console.log(error)
    }

    return res.status(500).send('Error')
}

module.exports = controllers
