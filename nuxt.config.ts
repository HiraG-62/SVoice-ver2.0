import { setupWebSocket } from "./server/socket"

export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  css: [
    "vuetify/lib/styles/main.sass"
  ],
  build: {
    transpile: ["vuetify"]
  },
  vite: {
    define: {
      "process.env.DEBUG": false
    },
    // for HMR
    server: {
      watch: {
        usePolling: true
      }
    },
  },
  hooks: {
    listen(server) {
      setupWebSocket();
    }
  },
  runtimeConfig: {
    public: {
      skywayAppId: '',
      skywaySecretKey: ''
    }
  }
})
