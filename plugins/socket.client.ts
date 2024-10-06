import { io, Socket } from 'socket.io-client'; // 必須のインポート

export default defineNuxtPlugin((nuxtApp) => {
  const socket: Socket = io('http://localhost:4000'); // サーバーのURLを指定

  // ソケットインスタンスをNuxtアプリに提供
  nuxtApp.provide('socket', socket);
});
