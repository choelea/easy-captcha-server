const clients = [
  { id: 'okchem', secret: '6LcMRS8UAAAAAFdwgbd4yob9n', domains: ['.localokchem.com:3000'] },
]

function Client(id, secret) {
  this.id = id
  this.secret = secret
}


/**
 * Find client if: clientId is registered, and ( the request is with valid domain or the request is having secret ).
 * @param {*} id
 * @param {*} secret
 * @param {*} origin
 */
function getClient(id, secret, origin) {
  const c = clients.find((item) => item.id === id)
  if (secret && secret === c.secret) return new Client(id, c.secret)
  if (c) {
    const domain = c.domains.find((item) => origin.endsWith(item))
    if (domain) return new Client(id, c.secret)
  }
  return undefined
}

/*
 *  Check and assign client to request
 *  Notes: will not check secret.
 */
exports.requiresValidClient = (req, res, next) => {
  const origin = req.get('Origin')
  const clientId = req.query.client || req.body.client
  const secret = req.query.secret || req.body.secret
  // console.log(`request is from ${origin} ${clientId} ${secret}`)
  if (origin && clientId) {
    const client = getClient(clientId, secret, origin)
    if (client) {
      req.captchaClient = client
      return next()
    }
  }
  return res.status(403).send('Invalid Client')
}
