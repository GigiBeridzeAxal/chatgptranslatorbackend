const express = require('express')
const { getmessages, getuserbyid, sendmessage, getuserfromquery, sendprivatemssage , userswhosentmessage } = require('../controllers/ChattingControllers')
const app = express()
const router = express.Router()






router.post('/getuserfromquery' , getuserfromquery)
router.post('/sendprivatemssage' , sendprivatemssage)
router.post('/getmessages' , getmessages)
router.post('/userswhosentmessage' , userswhosentmessage)

module.exports = router