const ChattingModel = require("../models/ChattingModel")




const getmessages = async(req,res) => {

    const {userid} = req.body

    const messagesbyid = await ChattingModel.find({userid} ).select('-profilepicture password')

    if(messagesbyid){
        console.log(messagesbyid)
        res.status(200).send(messagesbyid)
    }else{
        res.status(201).send("Something Went Wrong Please Try Again")
    }
    

}

module.exports = {getmessages}

