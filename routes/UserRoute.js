const express = require('express')
const { Register, login, VerifyToken, usercompleatedprofile, changeprofilepic, getuserinfo, gettopuser , checkuserlastonline , renewtime, changecanspeak, getusersbylanguage, changewanttolearn, getprofilebyid, GoogleAuth, getgoogleauth, PlanPurcashe, planend, changeabout, liketotalk, buyitem, updateaboutme, updateliketotalk, updatewanttolearn, updatecanteachyou } = require('../controllers/UserController')
const passport = require('passport')
const multerS3 = require('multer-s3');
const s3 = require('../services/AWS');
const path = require('path')

const multer = require('multer');
const UserModel = require('../models/UserModel');
const router = express.Router()




router.post('/register' , Register)
router.post('/login' , login)
router.post('/Verify' , VerifyToken)
router.post('/usercompleatedprofile' , usercompleatedprofile)

router.post('/getuserinfo' , getuserinfo)
router.post('/gettopuser' , gettopuser)
router.post('/checkuserlastonline' , checkuserlastonline)
router.post('/renewtime' , renewtime)
router.post('/changecanspeak' , changecanspeak)
router.post('/getusersbylanguage' , getusersbylanguage)
router.post('/changewanttolearn' , changewanttolearn)
router.post('/getprofilebyid' , getprofilebyid)
router.post('/GoogleAuth' , GoogleAuth)
router.post('/PlanPurcashe' , PlanPurcashe)
router.post('/planend' , planend)
router.post('/changeabout' , changeabout)
router.post('/liketotalk' , liketotalk)
router.post('/buyitem' , buyitem)
router.post('/updateaboutme' , updateaboutme)
router.post('/updateliketotalk' , updateliketotalk)
router.post('/updatewanttolearn' , updatewanttolearn)
router.post('/updatecanteachyou' , updatecanteachyou)






router.get('/auth/callback', 
    passport.authenticate('google', { failureRedirect: '/' , session:false }),
    (req, res) => {
      // Instead of using sessions, manually return a JWT
        res.redirect(`${process.env.frontend}login-success?token=${req.user.token}&`)
    }
  );

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


const storage = multer.memoryStorage()
const upload = multer({storage})

router.post('/changeprofilepic' , upload.single('image') , async(req,res) => {
  console.log(req.file)

  const params = {
    Bucket:process.env.bucketname,
    Key:`${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType:req.file.mimetype
  }

  const data = await s3.upload(params).promise()



  if(data){

        const finduserbyemail = await UserModel.findOne({email:req.body.email} , "compleatedprofile")


        if(finduserbyemail !== null){
            const updated = {
                profilepicture:data.Location,
                compleatedprofile:true

            }
          const update = await UserModel.updateOne({email:req.body.email} , {$set:updated})

          res.status(200).send("Ok")


        }



  }

}
) 

module.exports = router