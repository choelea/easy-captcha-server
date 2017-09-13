const express = require('express')
/* eslint-disable new-cap */
const router = express.Router()
/* eslint-enable new-cap */
const svgCaptcha = require('svg-captcha')
const jwt = require('jsonwebtoken')
const secret = 'secret'
const defaultOptions = {
  ignoreChars: '0o1ilL',
  noise: 2,
  size: 5,
  width: 150, // width of captcha
  height: 35, // height of captcha
  fontSize: 35,
}
const ERR_WRONG_CODE = 'codeWrong'
const ERR_EXPIRED_CODE = 'codeExpired'
/* GET home page. */
router.get('/', (req, res) => {
  const captcha = svgCaptcha.create(defaultOptions)
  const jwtToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 10), // 1 minute
    data: { c: captcha.text },
  }, secret)

  return res.render('captcha', { token: jwtToken, captchaSVG: captcha.data })
})

router.get('/svg', (req, res) => {
  const captcha = svgCaptcha.create(defaultOptions)
  res.type('svg')
  return res.status(200).send(captcha.data)
})

router.post('/verify', (req, res) => {
  let errCode = ERR_WRONG_CODE
  try {
    const decoded = jwt.verify(req.body.sCap, secret)
    const captchaText = decoded.data.c
    if (req.body.captchaCode && captchaText.toLowerCase() !== req.body.captchaCode.toLowerCase()) {
      return res.status(400).json({ err: errCode })
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      errCode = ERR_EXPIRED_CODE
    }
    return res.status(400).json({ err: errCode })
  }
  return res.status(200).json({ success: true })
})

module.exports = router
