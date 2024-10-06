<script setup lang="ts">

const loading = ref<boolean>(true);
const joining = ref<boolean>(false);
const joinLoad = ref<boolean>(false);

const {
  gamerTag,
  phoneSlider,
  micSlider
} = useComponents();

const joinClick = async () => {
  joinLoad.value = true;

  await useConnectSocket();
  const skywayRoom = useConnectSkyway(gamerTag.value);

  joinLoad.value = false;
  joining.value = !joining.value;
}

onMounted(async () => {
  await useAudio();
  await useAudioDevice();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  loading.value = false;
})

</script>

<template>
  <v-app class="background">
    <v-main>
      <v-overlay v-model="loading" absolute z-index="0" class="align-center justify-center">
        <v-progress-circular indeterminate size="64" color="blue"></v-progress-circular>
      </v-overlay>
      <v-container v-if="!loading" fill-height>
        <v-row justify="center" no-gutters>
          <img src="/public/images/logo.png" alt="" height="150px">
        </v-row>
        <v-row justify="center" align-content="center" no-gutters>
          <v-col cols="10" sm="10" md="8" lg="8" xl="8">
            <v-container id="main-container">
              <v-card color="#fffc" height="70vh">
                <v-toolbar height="80">
                  <voice-header />
                </v-toolbar>
                <v-row id="main" justify="center" align-content="center" no-gutters>
                  <v-btn v-if="!joining && !joinLoad" @click="joinClick" color="green" width="200">参加</v-btn>
                  <v-progress-circular v-else-if="joinLoad" indeterminate size="64" color="blue"></v-progress-circular>
                  <user-list v-else-if="joining" />
                </v-row>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;

  background-image: url('/public/images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#main {
  height: calc(70vh - 80px);
}

.table {
  background-color: #fff5;
}
</style>