import { Socket } from 'socket.io-client'

let socket: Socket;

interface SocketResponse {
  message: string;
}

export async function useConnectSocket() {
  const { $socket } = useNuxtApp();
  socket = $socket as Socket;

  const {
    gamerTag
  } = useComponents();

  socket.emit('join', gamerTag.value);

  await new Promise<void>((resolve) => {
    socket.on('joined', () => {
      resolve();
    })
  })
}

export async function useGetDataSocket(num: Ref) {
  socket.on('playerData', (data) => {
    num.value += 0.01;
    console.log(num);
  })
}