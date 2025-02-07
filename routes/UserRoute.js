const express = require('express')
const { Register, login, VerifyToken, usercompleatedprofile, changeprofilepic } = require('../controllers/UserController')
const router = express.Router()



router.post('/register' , Register)
router.post('/login' , login)
router.post('/Verify' , VerifyToken)
router.post('/usercompleatedprofile' , usercompleatedprofile)
router.post('/changeprofilepic' , changeprofilepic)


module.exports = router