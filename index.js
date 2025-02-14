const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const ConnectDB = require('./modules/ConnectDB')
const http = require('http')
const socketio = require('socket.io')
const jwt = require('jsonwebtoken')
const ChattingModel = require('./models/ChattingModel')

const server =  http.createServer(app)

const io = socketio(server , {cors:{
    origin:"*"
}})
dotenv.config()
app.use(cors({
    origin:'*'
   }))
   app.use(express.json({ limit: '250mb' }));  // For JSON requests (set limit to 10MB)
app.use(express.urlencoded({ limit: '250mb', extended: true }));  // For form submissions
app.use(express.json())
ConnectDB()

app.use('/' , require('./routes/UserRoute'))
app.use('/' , require('./routes/Chattingrouter'))

const users = {}

io.on('connection' , (stream) => {

    console.log(stream.id , "User Connected" , stream.handshake.query.userid)

    if(stream.handshake.query.userid !== undefined){
        users[stream.id] = stream.handshake.query.userid

    }



    stream.on("newmessage" , (data) => {



        const userbyid = generatespeicifuserid(data.data.sendto)

         console.log( data.data)

         if(userbyid){
            io.to(userbyid).emit('addednewmessages' , data)
         }
         const allmessage = data.data
         const savemessage = ChattingModel.create({sendto:allmessage.sendto , sendby:allmessage.sendby , sendtime:Date.now() , message:allmessage.message})

         
         stream.emit('addednewmessages' ,data)


    })

    const generatespeicifuserid = (userid) => {

        for(const user in users){

            if(users[user] == userid){
                return user
            }
        }
        return null

    }

    

    

       stream.emit("onlineusers" , {users:Object.values(users)})

    stream.on("Getonlineusers" , () => {

        console.log(users)
        stream.emit("onlineusers" , {users:Object.values(users)})
        
    })



    stream.on("disconnect" , () => {
        console.log("USer Disconected" , (stream.id))
        delete users[stream.id]
        io.emit("disc" , {users:Object.values(users)})
       

    })


  

})







server.listen(4000 , console.log("Server Succesfuly Launched"))