const express = require('express') 
const cors = require('cors') 
const http = require('http')
const {Server} = require('socket.io')

const app = express() 

const httpServer = http.createServer(express)

const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on('connection',(socket)=>{
    console.log(`new Socket connection: ${socket.id}`)

    socket.on('joinroom',(data)=>{
        socket.join(data)
    })

    socket.on('send-message',(data)=>{
        const obj={message:data.message,id:socket.id}
        io.to(data.room).emit('receive-message',obj)
    })
})

httpServer.listen(3500,()=>{
    console.log("Server is running on port 3500.")
})
