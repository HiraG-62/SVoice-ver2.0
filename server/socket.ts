import { Server } from 'socket.io'
import { createServer } from 'http'

interface userData {
  gamerTag: string | null
}

export function setupWebSocket() {
  const httpServer = createServer()
  const io = new Server(httpServer, {
    path: '/',
    cors: {
      origin: '*',
    }
  })

  const userMap: Map<string, userData> = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected: ' + socket.id);
    userMap.set(socket.id, {
        gamerTag: null
    });

    socket.on('join', (data) => {
      userMap.set(socket.id, {
        gamerTag: data
      })
      socket.emit('joined');
    });

    setInterval(() => {
      if(userMap.get(socket.id) != null) {
        socket.emit('playerData', 'data');
      }
    }, 1000)

    socket.on('disconnect', () => {
      userMap.delete(socket.id);
      console.log('Client disconnected: ' + socket.id);
    });
  })

  httpServer.listen(4000, () => {
    console.log('WebSocket server running on port 4000')
  })
}
