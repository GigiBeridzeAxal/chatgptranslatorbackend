const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')



const Register = async(req,res) => {

    const {email , firstname , lastname , password} = req.body


    if(!email || !firstname || !lastname || !password){
        res.status(202).send("All Fields Required")
    }else{

     const finduserbyemail = await UserModel.find({email:email})

     console.log(finduserbyemail[0])

     if(finduserbyemail[0] == undefined){

        const createnewuser = await UserModel.create({email , firstname , lastname , password})

        if(createnewuser){
            const token = await jwt.sign({firstname , email , lastname} , process.env.SECRETKEY)
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
        const findifuserexist = await UserModel.find({email:email})

        if(findifuserexist[0] !== undefined){
            if(findifuserexist[0].password === password){
                const email = findifuserexist[0].email
                const firstname = findifuserexist[0].firstname
                const lastname = findifuserexist[0].lastname
                const token = jwt.sign({email , firstname , lastname} , process.env.SECRETKEY , {expiresIn:'1m'})
                res.status(200).send(token)
            }else{
                res.status(204).send("Password Didnt Match")
            }
        }else{
            res.status(202).send("Email Didn't Exist")
        }

    }
    

}

const usercompleatedprofile = async(req,res) => {

    const {email} = req.body

    if(!email){
        res.status(203).send("All Fields Are Required")
    }else{

        const finduser = await UserModel.find({email:email})  

        if(finduser[0] !== undefined){
            if(finduser[0].compleatedprofile == false){
                res.status(201).send("Not Completed")
            }else{
                res.status(200).send("Completed")   
            }
        }else{
            res.status(204).send("User Not Defined")   
        }

    }

}

const changeprofilepic = async(req , res) => {

    const {image , email} = req.body

    if(!image || !email){
        console.log("Image Not Defined")
    }else{

        const finduserbyemail = await UserModel.find({email:email})


        if(finduserbyemail[0] !== undefined){
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


module.exports = {Register, login , usercompleatedprofile , VerifyToken , changeprofilepic}