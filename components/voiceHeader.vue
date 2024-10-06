<script setup lang="ts">

const {
  gamerTag,
  isSelfMute,
  isJoining
} = useComponents();

const settingDialog = ref();

const openSetting = () => {
  if(settingDialog.value) {
    settingDialog.value.open();
  }
}

const drawer = ref<boolean>(false);

</script>

<template>
  <v-container>
    <v-row justify="center" align-content="center" no-gutters>
      <v-col cols="10">
        <v-toolbar-title>
          <v-icon size="x-large">mdi-account-circle</v-icon>
          {{ gamerTag }}
        </v-toolbar-title>
        <v-label>
          ステータス：
        </v-label>
        <span :class="isJoining ? 'text-green' : 'text-red'" class="mr-4">
          {{ isJoining ? '参加中' : '待機中' }}
        </span>
      </v-col>
      <v-col cols="2" class="d-flex justify-center align-center">
        <v-icon size="x-large" @click="isSelfMute = !isSelfMute" :class="['mr-2']" :color="isSelfMute ? 'red' : ''">
          {{ isSelfMute ? 'mdi-microphone-off' : 'mdi-microphone' }}
        </v-icon>
        <v-icon size="x-large" @click="openSetting" class="mr-2">mdi-cog</v-icon>
        <setting-wrap ref="settingDialog"/>
      </v-col>
    </v-row>
  </v-container>
</template>