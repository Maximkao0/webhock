const Router = require('express')
const Controller = require("./Controller.js")

const router = new Router()

router.post('/test', Controller.update);

module.exports = router