
const express = require('express')
const { translatetext, translateauido } = require('../controllers/OpenAiController')
const { Audiotranslator } = require('../services/OpenAi')
const router = express.Router()


router.post("/TranslateText" , translatetext)
router.post("/translateauido" , translateauido)



module.exports = router