const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')



const Register = async(req,res) => {

    const {email , firstname , lastname , password} = req.body


    if(!email || !firstname || !lastname || !password){
        res.status(202).send("All Fields Required")
    }else{

     const finduserbyemail = await UserModel.find({email:email})




     if(finduserbyemail[0] == undefined){

        const createnewuser = await UserModel.create({email , firstname , lastname , password})

        console.log(createnewuser)

        if(createnewuser){
            const token = await jwt.sign({firstname , email , lastname} , process.env.SECRETKEY , {expiresIn:'1d'})
            res.status(200).send(token)
        }else{
            res.status(201).send("Something Went Wrong Please Try Again")
        }


     }else{
        res.status(203).send("Email Already Registered")
     }
    }
    


}

const login = async(req,res) => {

    const {email , password} = req.body

    if(!email || !password){
        res.status(203).send("All Fields Are Required")
    }else{
        const findifuserexist = await UserModel.findOne({email:email} , "email firstname lastname password")

        if(findifuserexist !== null){
            if(findifuserexist.password === password){
                const email = findifuserexist.email
                const firstname = findifuserexist.firstname
                const lastname = findifuserexist.lastname
                const id = findifuserexist._id
                const token = jwt.sign({email , firstname , lastname , id} , process.env.SECRETKEY , {expiresIn:'1d'})
                res.status(200).send(token)
            }else{
                res.status(201).send('Password didnt match')
            }
        }else{
            res.status(202).send("Email Didn't Exist")
        }

    }
    

}

const getgoogleauth = () => {
    const passport = require("passport");

    passport.authenticate('google' , {scope:["profile" , "email"]})

}

const GoogleAuth = () => {
    const passport = require("passport");
    const GoogleStrategy = require("passport-google-oauth20").Strategy;
    const FacebookStrategy = require("passport-facebook").Strategy;


    passport.use(new GoogleStrategy({
        clientID: process.env.GoogleId,
        clientSecret: process.env.GoogleSecret,
        callbackURL: "http://localhost:4000/googlecallback"
    }, function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }

)
  

)




}

const googlecallback = (req,res) => {
    console.log(req)
}

const usercompleatedprofile = async(req,res) => {

    const {email} = req.body

    if(!email){
        res.status(203).send("All Fields Are Required")
    }else{

        const finduser = await UserModel.findOne({email:email} , "compleatedprofile")  


        if(finduser !== null){
            if(finduser.compleatedprofile == false){
                res.status(201).send("Not Completed")
            }else{
                res.status(200).send("Completed")   
            }
        }else{
            res.status(204).send("User Not Defined")   
        }

    }

}

const changecanspeak = async(req,res) => {

    
    const {canspeak , email} = req.body

    const update = await UserModel.updateOne({email:email} , {$set:{canspeak:canspeak}})

    if(update){
        res.status(200).send("Ok")
    }else{
        res.status(201).send("Something Went Wrong")
    }

}

const changewanttolearn = async(req,res) => {

    
    const {wanttolearn , email} = req.body

    const update = await UserModel.updateOne({email:email} , {$set:{wanttolearn:wanttolearn}})

    if(update){
        res.status(200).send("Ok")
    }else{
        res.status(201).send("Something Went Wrong")
    }

}

const gettopuser = async(req,res) => {
    

        const find = await UserModel.find()

        res.status(200).send(find)

        

}

const getuserinfo =  async(req,res) => {


    const {email} = req.body

    if(!email){
        res.status(203).send("Email Not Defined")
    }else{
        const find = await UserModel.find({email:email}).sort({lastonline:-1})


        if(find[0] !== undefined){
            res.status(200).send(find)
        }else{
            res.status(201).send("User Didn't Exist")
        }
    }

}

const changeprofilepic = async(req , res) => {

    const {image , email} = req.body

    if(!image || !email){
        console.log("Image Not Defined")
    }else{

        const finduserbyemail = await UserModel.findOne({email:email} , "compleatedprofile")


        if(finduserbyemail !== null){
            const updated = {
                profilepicture:image,
                compleatedprofile:true

            }
          const update = await UserModel.updateOne({email:email} , {$set:updated})

          res.status(200).send("Ok")


        }




    }

}

const VerifyToken = (req,res) => {
    const {token} = req.body
      

    if(token){

        try{
            jwt.verify(token , process.env.SECRETKEY)
         res.status(200).send("Token Is Valid")
       }catch(err){
        console.log(err)
          res.status(201).send("Token Is Not Valid")
       }
    }

        


    

    }


    const checkuserlastonline = async(req,res) => {
        const {email} = req.body

        const find = await UserModel.find({} , 'lastonline email')


        res.status(200).send(find)

       


    }
    const renewtime = async(req,res) => {
        const {email} = req.body


        const renew = await UserModel.updateOne({email:email} , {$set:{lastonline:Date.now()}})

        if(renew){
            res.status(200).send("ok")
        }
    }

    const getusersbylanguage = async(req,res) => {


        const getusers = await UserModel.find({compleatedprofile:true} , "email lastonline profilepicture canspeak wanttolearn firstname lastname").sort({lastonline:-1})


        if(getusers){
            res.status(200).send(getusers)
        }else{
            res.status(201).send("Something Went Wrong")
        }


        


    }


    const getprofilebyid = async(req,res) => {

        const {id} = req.body

        const getuserinfoer = await UserModel.find({_id:id})

        if(getuserinfoer){
            res.status(200).send(getuserinfoer)
        }else{
            res.status(404).send("User Not FOund")
        }

    }


    


module.exports = {Register, getgoogleauth , googlecallback, GoogleAuth , getprofilebyid, getusersbylanguage ,changewanttolearn , login , usercompleatedprofile , VerifyToken , changecanspeak , changeprofilepic , getuserinfo , gettopuser , checkuserlastonline , renewtime}