const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({

    firstname:{
        type:String,
        required:true
    },
    
    lastname:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true
    },
    credits:{
        type:Number,
        required:true,
        default:15
    },
    compleatedprofile:{
        type:Boolean,
        required:true,
        default:false
    },
    profilepicture:{
        type:String,
        required:true,
        default:'no'
    },
    plan:{
        type:Array,
        required:true,
        default:[
            {
                plan:"Free",
                activationtime:Date.now()
                
            }
        ]
    },
    lastonline:{
        type:Number,
        required:true,
        default:Date.now()
    },
    canspeak:{
        type:Array,
        required:true,
    },
    wanttolearn:{
        type:Array,
        required:true,
    },
    aboutme:{
        type:String,

        default:''
    },
    liketotalk:{
        type:String,
   
        default:''
    },
    
    

    


})

module.exports = mongoose.model('Users' , UserSchema)