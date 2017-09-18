const index = require('./admin/index')
const client = require('./admin/client')
module.exports = (app) => {
  app.use('/admin', index)
  app.use('/admin/clients', client)
  app.use((req, res) => {
    res.status(404)
    res.render('404', { title: '404', message: 'This page does not exist.' })
  })
}

