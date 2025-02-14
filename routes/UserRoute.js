const express = require('express')
const { Register, login, VerifyToken, usercompleatedprofile, changeprofilepic, getuserinfo, gettopuser , checkuserlastonline , renewtime, changecanspeak, getusersbylanguage, changewanttolearn, getprofilebyid } = require('../controllers/UserController')

const router = express.Router()



router.post('/register' , Register)
router.post('/login' , login)
router.post('/Verify' , VerifyToken)
router.post('/usercompleatedprofile' , usercompleatedprofile)
router.post('/changeprofilepic' , changeprofilepic)
router.post('/getuserinfo' , getuserinfo)
router.post('/gettopuser' , gettopuser)
router.post('/checkuserlastonline' , checkuserlastonline)
router.post('/renewtime' , renewtime)
router.post('/changecanspeak' , changecanspeak)
router.post('/getusersbylanguage' , getusersbylanguage)
router.post('/changewanttolearn' , changewanttolearn)
router.post('/getprofilebyid' , getprofilebyid)



module.exports = router