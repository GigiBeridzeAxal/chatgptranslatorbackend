const express = require('express')
const { Register, login, VerifyToken, usercompleatedprofile, changeprofilepic, getuserinfo, gettopuser } = require('../controllers/UserController')
const router = express.Router()



router.post('/register' , Register)
router.post('/login' , login)
router.post('/Verify' , VerifyToken)
router.post('/usercompleatedprofile' , usercompleatedprofile)
router.post('/changeprofilepic' , changeprofilepic)
router.post('/getuserinfo' , getuserinfo)
router.post('/gettopuser' , gettopuser)

module.exports = router