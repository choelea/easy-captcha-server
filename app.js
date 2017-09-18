const express = require('express')
const exphbs = require('express-handlebars')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const captcha = require('./routes/captcha')
const adminRoutes = require('./routes/adminRoutes')
const cors = require('cors')
const app = express()
app.use(cors())
// view engine setup
app.engine('.html', exphbs({ defaultLayout: 'main', extname: '.html' }))
app.set('view engine', 'html')

app.use(express.static(`${__dirname}/public`))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


app.use('/captcha', captcha)
adminRoutes(app)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  const locals = res.locals
  locals.message = err.message
  locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
