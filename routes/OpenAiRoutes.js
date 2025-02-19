
const express = require('express')
const { translatetext } = require('../controllers/OpenAiController')
const router = express.Router()


router.post("/TranslateText" , translatetext)




module.exports = router