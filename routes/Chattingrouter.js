const express = require('express')
const { getmessages } = require('../controllers/ChattingControllers')
const app = express()
const router = express.Router()




router.post('/getmessage' , getmessages )



module.exports = router