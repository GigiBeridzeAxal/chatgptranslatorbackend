const ChattingModel = require("../models/ChattingModel")
const UserModel = require("../models/UserModel")
const { CheckUserId, io } = require("../socket")

const getuserfromquery = async(req,res) => {

    const {userid} = req.body


    const getuserbyid = await UserModel.find({_id:userid})


    if(getuserbyid[0] !== undefined){
        res.status(200).send(getuserbyid)
    }else{

        res.status(404).send("Not Found")
    }


}


const getmessages = async(req,res) => {

    const {userid} = req.body


    const findmessages = await ChattingModel.find({$or:[
        {sendto:userid},
        {sendby:userid},
    ]})

    if(findmessages){
        res.status(200).send(findmessages)
    }else[
        res.status(400).send("Network Error Try Again")
    ]


}

const userswhosentmessage = async(req,res) => {

    const {queryuser , Authuser} = req.body



    




        const getallmsesagessend = await ChattingModel.find({$or:[
            {sendby: Authuser.id},
            {sendto: Authuser.id},
        ]}).sort({sendtime:-1})




     
       
 
    


      
        const users = getallmsesagessend.filter(data => data.sendby === Authuser.id || data.sendto === Authuser.id )
        const list = [
            ...users.map(data => data.sendby),
            ...users.map(data => data.sendto),
            queryuser ? String(queryuser) : null

        ].filter(data => data !== Authuser.id)

        


       const getusers = await UserModel.find( {_id: {$in:list}} ).select('-password')





       if(getusers !== undefined){
         res.status(200).send(getusers)
     }

      

     


}



const sendprivatemssage = async(req,res) => {


    const {param} = req.body


    console.log(param)




    
    const streamidtosend = CheckUserId(param.sendto)
    const streamidsendby = CheckUserId(param.sendby)

    const params = {...param , sendtime:Date.now()}
    
    if(streamidtosend){
        io.to(streamidtosend.userid).emit("NewMessage" , params)
    }
    if(streamidsendby){

        io.to(streamidsendby.userid).emit("NewMessage" , params)
    }

    const createmessage = await ChattingModel.create(params)

    if(createmessage){
        res.status(200).send("Succesfuly Created New Message")
    }else{
        res.status(400).send("Something Went Wrong We Cant Create Message Now Try Again Later")
    }



   




}

module.exports = {getuserfromquery , sendprivatemssage , getmessages , userswhosentmessage}

