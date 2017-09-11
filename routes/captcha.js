var express = require('express');
var router = express.Router();
var svgCaptcha = require('svg-captcha');
var jwt = require('jsonwebtoken');
// const uuidv4 = require('uuid/v4');
const secret = 'secret'
/* GET home page. */
router.get('/', function(req, res, next) {
  var captcha = svgCaptcha.create();
  var token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 10), // 1 minute
    data: { c: captcha.text }
  }, secret);

  return  res.render('captcha', {token: token, captchaSVG: captcha.data })
});

router.post('/verify', function(req, res, next) {
  console.log(' test'+JSON.stringify(req.body))
  let errCode = 'codeWrong'
  try {    
    const decoded = jwt.verify(req.body.sCap, secret)
    const captchaText = decoded.data.c
    if(req.body.captchaCode && captchaText.toLowerCase()  != req.body.captchaCode.toLowerCase() ){
      return res.status(400).json({err:errCode})
    }
  } catch(err) {
    console.log('llllllllllllllllllllll')
    if(err.name==='TokenExpiredError'){
      return errCode = 'codeExpire'
    }
    return res.status(400).json({err:errCode})
  }
  return res.status(200).json({success:true})
});

module.exports = router;
