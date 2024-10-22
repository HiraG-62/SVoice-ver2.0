<script setup lang="ts">

const {
  gamerTag,
  isSelfMute,
  isNoiseSuppression,
  isJoining
} = useComponents();

const toggleNoiseSuppression = () => {
  isNoiseSuppression.value = !isNoiseSuppression.value;
  useNoiseSuppression();
}

const settingDialog = ref();

const openSetting = () => {
  if(settingDialog.value) {
    settingDialog.value.open();
  }
}

</script>

<template>
  <v-container>
    <v-row justify="center" align-content="center" no-gutters>
      <v-col cols="9">
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
      <v-col cols="3" class="d-flex justify-center align-center">
        <v-tooltip :text="isSelfMute ? 'ミュート解除' : 'ミュート'" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="x-large" @click="isSelfMute = !isSelfMute" :class="['mr-1']" :color="isSelfMute ? 'red' : ''">
              {{ isSelfMute ? 'mdi-microphone-off' : 'mdi-microphone' }}
            </v-icon>
          </template>
        </v-tooltip>
        <v-tooltip :text="isNoiseSuppression ? 'ノイズ抑制解除' : 'ノイズ抑制'" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="x-large" @click="toggleNoiseSuppression" :class="['mr-2']" :color="isNoiseSuppression ? 'green' : ''">
              mdi-waveform
            </v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="設定" location="top">
          <template #activator="{ props }">
            <v-icon v-bind="props" size="x-large" @click="openSetting" class="mr-2">mdi-cog</v-icon>
          </template>
        </v-tooltip>
        <setting-wrap ref="settingDialog"/>
      </v-col>
    </v-row>
  </v-container>
</template>