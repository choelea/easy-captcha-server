const express = require('express')
/* eslint-disable new-cap */
const router = express.Router()
/* eslint-enable new-cap */
router.get('/', (req, res) => {
  res.render('index')
})
module.exports = router
