const express = require('express') 
const cors = require('cors') 
const http = require('http')
const {Server} = require('socket.io')

const app = express() 

const corsOptions = {
    origin: 'https://socket-io-room-chat-frontend-vx3e.vercel.app', //http://localhost:3000
  };

app.use(cors(corsOptions))

const httpServer = http.createServer(app)

const io = new Server(httpServer,{
    cors:{
        origin:'https://socket-io-room-chat-frontend-vx3e.vercel.app' //http://localhost:3000
        }
})

io.on('connection',(socket)=>{
    console.log(`new Socket connection: ${socket.id}`)

    socket.on('joinroom',(data)=>{
        socket.join(data)
        const roomClients = io.sockets.adapter.rooms.get(data);
        if (roomClients) {
            const numClients = roomClients.size;
            io.to(data).emit('receive-rooms',numClients)
        }
    })

    socket.on('leave-room',(data)=>{
        socket.leave(data.room)
        const roomClients = io.sockets.adapter.rooms.get(data.room);
        if (roomClients) {
            const numClients = roomClients.size;
            io.to(data.room).emit('receive-rooms',numClients)
        }
    })

    socket.on('send-message',(data)=>{
        const obj={
            message:data.message,
            id:socket.id,
            time:new Date().getUTCHours()+5+":"+new Date().getUTCMinutes()+30,
            name:data.name
        }
        io.to(data.room).emit('receive-message',obj)
    })
})

httpServer.listen(3500,()=>{
    console.log("Server is running on port 3500.")
})
