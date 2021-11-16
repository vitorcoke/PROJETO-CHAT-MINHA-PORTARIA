import express from 'express'
import socket from 'socket.io'
import http from 'http'
import cors from 'cors'
import { addUser, getUser, getUserInRom, removeUser } from './users'

const app = express()
const httpServer = http.createServer(app)
const io = new socket.Server(httpServer, {
  cors: {
    origin: '*',
  }
})
const porta = 8081

app.use(express.json())

app.use(cors())

io.on("connection", (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })

    if (error) return socket.emit('error', error)

    socket.join(user?.room)

    io.to(user?.room).emit('getUser', {
      user: getUserInRom(user?.room)
    })

    callback()

  });

  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id)
    io.to(user?.room).emit('message', { user: user?.name, text: message.text, time: message.time });

  })

  socket.on('disconnect', data => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user?.room).emit('getUser', {
        user: getUserInRom(user?.room)
      })
    }

  })

})

httpServer.listen(porta)






