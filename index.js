const express = require('express') 
const cors = require('cors') 
const http = require('http')
const {Server} = require('socket.io')

const app = express() 

const corsOptions = {
    origin: 'https://socket-io-room-chat-frontend-vx3e.vercel.app/',
  };

app.use(cors(corsOptions))

const httpServer = http.createServer(app)

const io = new Server(httpServer,{
    cors:{
        origin:'https://socket-io-room-chat-frontend-vx3e.vercel.app/'
    }
})

io.on('connection',(socket)=>{
    console.log(`new Socket connection: ${socket.id}`)

    socket.on('joinroom',(data)=>{
        socket.join(data)
    })

    socket.on('send-message',(data)=>{
        const obj={message:data.message,id:socket.id,time:new Date().toTimeString().slice(0,8)+','+new Date().toLocaleDateString()}
        io.to(data.room).emit('receive-message',obj)
    })
})

httpServer.listen(3500,()=>{
    console.log("Server is running on port 3500.")
})
