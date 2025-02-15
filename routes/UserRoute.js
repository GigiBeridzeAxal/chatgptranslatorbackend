const express = require('express')
const { Register, login, VerifyToken, usercompleatedprofile, changeprofilepic, getuserinfo, gettopuser , checkuserlastonline , renewtime, changecanspeak, getusersbylanguage, changewanttolearn, getprofilebyid, GoogleAuth, getgoogleauth } = require('../controllers/UserController')
const passport = require('passport')

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
router.post('/GoogleAuth' , GoogleAuth)


router.get('/auth/callback', 
    passport.authenticate('google', { failureRedirect: '/' , session:false }),
    (req, res) => {
      // Instead of using sessions, manually return a JWT
        res.redirect(`https://chatgpt-translator-xi.vercel.app/login-success?token=${req.user.token}&`)
    }
  );

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


module.exports = router