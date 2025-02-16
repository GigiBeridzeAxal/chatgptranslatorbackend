const socket = require('socket.io')
const http = require('http')
const app = require('express')()

const server = http.createServer(app)
const io = new socket.Server(server , {
    cors:{origin:"*"}
})


io.on('connection' , (stream) => {

    console.log(stream.id , "User Connected")


    stream.on('disconnect', (User) => {

        console.log("User Disconected" , User)
        

    })



})




module.exports = {io , app ,server}