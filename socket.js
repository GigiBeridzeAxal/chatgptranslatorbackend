
import {Server} from 'socket.io'

import http from 'http'
import express from 'express'
const app = express()
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server , {
    cors:{origin:"*"}
})


const users = {}


export function CheckUserId(userid) {

    return { userid:users[userid]}
}

io.on('connection' , (stream) => {


    const userid = stream.handshake.query.userID

    users[userid] = stream.id


    io.emit("NewUser" , Object.keys(users))





    stream.on('disconnect', (User) => {



        delete users[userid]
        
        io.emit("NewUser" , Object.keys(users))

    })



})




export {io , app ,server }