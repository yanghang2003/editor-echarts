<template>
  <div class="app-container">
    <div v-if="showAside">
      <Aside />
    </div>
    <router-view />
  </div>
</template>

<script setup>
import Aside from '../components/Aside.vue';
import bus from '@/utils/bus';
import { ref, onMounted, onUnmounted } from 'vue';

const showAside = ref(false);

function changeEmbed(value) {
  showAside.value = value;
}

onMounted(() => {
  bus.on('showAside', changeEmbed);
});

onUnmounted(() => {
  bus.off('showAside', changeEmbed);
});
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
</style>
