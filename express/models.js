var path = require('path')
var { Sequelize, DataTypes } = require('sequelize')
var sequelize = new Sequelize('sqlite:' + path.resolve(__dirname + '/../urlshorter.db'))

const Url = sequelize.define('url',
    {
        name: DataTypes.STRING,
        real_url: DataTypes.STRING,
        short_id: DataTypes.STRING,
        visited: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'urls'
    }
)

sequelize.sync()
.then(async () => {
    try {
        let urls = await Url.findAll()
        if (urls.length == 0) {
            let new_url = await Url.create({
                name: 'Urlshorter GitHub',
                real_url: 'https://github.com/mynameismail/urlshorter'
            })
            new_url.short_id = idToShort(new_url.id)
            new_url.save()
            .then(url => console.log(url.toJSON()))
        }
    } catch (err) {
        console.log(err)
    }
})

const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const idToShort = id => {
    let short = ''
    while (id > 0) {
        short += base62.charAt(id % 62)
        id = Math.floor(id / 62)
    }

    return short.split('').reverse().join('')
}

const shortToId = short => {
    let id = 0
    for (let i = 0; i < short.length; i++) {
        id = id * 62 + base62.indexOf(short.charAt(i))
    }

    return id
}

module.exports = { Url, idToShort, shortToId }
