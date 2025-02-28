const multer = require('multer')
const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const multerS3 = require('multer-s3');
const s3 = require('../services/AWS');
const { OpenAiSuggested } = require('../services/OpenAi');



const Register = async(req,res) => {

    const {email , firstname , lastname , password} = req.body


    if(!email || !firstname || !lastname || !password){
        res.status(202).send("All Fields Required")
    }else{

     const finduserbyemail = await UserModel.find({email:email})




     if(finduserbyemail[0] == undefined){

        const createnewuser = await UserModel.create({email , firstname , lastname , password})



        if(createnewuser){
            const id = createnewuser._id
            const token = await jwt.sign({firstname , email , lastname , id} , process.env.SECRETKEY , {expiresIn:'1d'})
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
        callbackURL: `${process.env.backend}/googlecallback`
    }, function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }

)
  

)




}

const googlecallback = (req,res) => {

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

const upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:process.env.bucketname,
        acl:'public-read',
        metadata:(req,file,cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            // Set unique file name
            cb(null, Date.now().toString() + path.extname(file.originalname));
          },
    })
})

const changeprofilepic = (upload.single('image') , async(req,res) => {


    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
      }
    



    const {image , email} = req.body

    if(!image || !email){

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
) 
const VerifyToken = (req,res) => {
    const {token} = req.body
      

    if(token){

        try{
            jwt.verify(token , process.env.SECRETKEY)
         res.status(200).send(token)
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

        const {userid} = req.body

        console.log(userid, 'this is uerid')


        const getusers = await UserModel.find({compleatedprofile:true}).sort({lastonline:-1}).select("-password")

        const mainuser = getusers.filter(filt => filt._id == userid)
       // getusers.filter(data => console.log(data._id))
      const maincanspeak = mainuser[0].canspeak.map(data => data.selectedlanguage)
      const mainwanttolearn = mainuser[0].wanttolearn.map(data => data.selectedlanguage)

      const sorted = mainuser


     

    const bestmatches = (arr) => {
        
        for(let i = 0; i < arr.length; i++) {

        let matches = 0

        const canspeak =  getusers[i].canspeak.map(data => data.selectedlanguage)
        const wanttolearn = getusers[i].wanttolearn.map(data => data.selectedlanguage)

        for (let j = 0; j < canspeak.length; j++) {



            if(mainwanttolearn.includes(canspeak[j])){
             matches++
            }
            
   
         }

        for (let j = 0; j < wanttolearn.length; j++) {



           if(maincanspeak.includes(wanttolearn[j])){
            matches++
           }
           
  
        }


        arr[i] = {...arr[i] , matches}

   

   
        
      }

      return arr

    
    } 


 
    


      const alluser = [
        ...getusers
      ]
      const sortedforuser = bestmatches(alluser)
      const BestUsers = sortedforuser.sort((a,b) => b.matches - a.matches)




        if(getusers){
            
            res.status(200).send({getusers , BestUsers})
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


    const planend = async(req,res) => {

        const {userid} = req.body
        try{

            console.log(userid)


            const update = await UserModel.updateOne({_id:userid} , {$set:{plan:[
                {plan:"Free" , activationtime:Date.now()}
            ]}})
            res.status(200).send("Succesfuly End")
        }catch(err){
            console.log(err)
        }
 

        


    }


    const PlanPurcashe = async(req,res) => {

        const {userid , plan} = req.body
        console.log(userid , plan)
        const usercredits = await UserModel.findOne({_id:userid})

        const update = await UserModel.updateOne({_id:userid} , {$set:{credits:usercredits.credits + 1500 ,plan:[
            {plan:plan.toString() , activationtime:Date.now()}
        ]}})
        


        if(update){
            console.log("Working")

            res.status(200).send("Ok")
        }

    }

    const changeabout = async(req,res) => {
        
        const {email , about} = req.body

       try{
        const update = await UserModel.updateOne({email:email}  , {$set:{aboutme:about}})
        res.status(200).send('ok')


       }catch(err){
        res.status(400).send('ok')
       }


    }
    const liketotalk = async(req,res) => {
        
        const {email , liketotalk} = req.body

       try{
        const update = await UserModel.updateOne({email:email}  , {$set:{liketotalk:liketotalk}})
        res.status(200).send('ok')


       }catch(err){
        res.status(400).send('ok')
       }


    }
    
    const buyitem = async(req,res) => {


        const {item , email} = req.body
        try{


            const updatecredits = async(creditvalue) => {

                const user = await UserModel.findOne({email:email})
                const credit = user.credits - creditvalue

                const update =await UserModel.updateOne({email:email} ,  {$set:{credits:credit}})

                

                res.json(credit)

            }


            switch (item) {
                case 'Translate':

                updatecredits(3)

                    break;
            
                default:
                    break;
            }


        }catch(err){
            res.status(400).send(err)
        }

    }


module.exports = {Register,PlanPurcashe , buyitem, liketotalk ,changeabout, planend , getgoogleauth , googlecallback, GoogleAuth , getprofilebyid, getusersbylanguage ,changewanttolearn , login , usercompleatedprofile , VerifyToken , changecanspeak , changeprofilepic , getuserinfo , gettopuser , checkuserlastonline , renewtime}