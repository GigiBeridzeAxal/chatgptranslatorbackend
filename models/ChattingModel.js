const mongoose = require('mongoose')


const ChatSchema = mongoose.Schema({

    sendto:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    sendby:{
        type:String,
        required:true
    },
    sendtime:{
        type:Number,
        required:true
    },

})


module.exports = mongoose.model("Messages" , ChatSchema)