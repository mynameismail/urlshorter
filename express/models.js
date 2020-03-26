var path = require('path')
var { Sequelize, DataTypes } = require('sequelize')
var sequelize = new Sequelize('sqlite:' + path.resolve(__dirname + '/../urlshorter.db'))

const Url = sequelize.define('url',
  {
    name: DataTypes.STRING,
    real_url: DataTypes.STRING,
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
      Url.create({
        name: 'Urlshorter GitHub',
        real_url: 'https://github.com/mynameismail/urlshorter'
      })
      .then(url => console.log(url.toJSON()))
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = { Url }
