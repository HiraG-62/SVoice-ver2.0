<script setup lang="ts">
const headers: any[] = [
  {
    title: 'ゲーマータグ',
    align: 'start',
    sortable: true,
    key: 'gamerTag',
    width: '30%'
  },
  {
    title: 'ユーザーネーム',
    align: 'start',
    sortable: false,
    key: 'userName',
    width: '30%'
  },
  {
    title: '音量',
    align: 'center',
    sortable: false,
    key: 'volume',
    width: '40%'
  }
]

const dataset = [
  {
    gamerTag: 'HiraG62',
    userName: 'ひいらぎ'
  },
  {
    gamerTag: 'badminton0717',
    userName: 'けい'
  }
]

const testData: Array<object> = [];

const setTestData = () => {
  for (let i = 0; i < 100; i++) {
    testData.push(dataset[0]);
    testData.push(dataset[1]);
  }
}

setTestData();

const sliderValues = ref<number[]>([]);

onMounted(() => {
  sliderValues.value = testData.map(() => 100);
})
</script>


<template>
  <v-data-table items-per-page="-1" :headers="headers" :items="dataset" :hide-default-footer="true"
    :fixed-header="true" class="fill-height table">
    <template v-slot:item.volume="{ index }">
      <v-slider v-model="sliderValues[index]" :max="200" :min="0"></v-slider>
    </template>
  </v-data-table>
</template>