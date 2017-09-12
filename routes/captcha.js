const express = require('express')
/* eslint-disable new-cap */
const router = express.Router()
/* eslint-enable new-cap */
const svgCaptcha = require('svg-captcha')
const jwt = require('jsonwebtoken')
// const uuidv4 = require('uuid/v4')
const secret = 'secret'
/* GET home page. */
router.get('/', (req, res) => {
  const captcha = svgCaptcha.create()
  const jwtToken = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 10), // 1 minute
    data: { c: captcha.text },
  }, secret)

  return res.render('captcha', { token: jwtToken, captchaSVG: captcha.data })
})

router.post('/verify', (req, res) => {
  let errCode = 'codeWrong'
  try {
    const decoded = jwt.verify(req.body.sCap, secret)
    const captchaText = decoded.data.c
    if (req.body.captchaCode && captchaText.toLowerCase() !== req.body.captchaCode.toLowerCase()) {
      return res.status(400).json({ err: errCode })
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      errCode = 'codeExpire'
    }
    return res.status(400).json({ err: errCode })
  }
  return res.status(200).json({ success: true })
})

module.exports = router
