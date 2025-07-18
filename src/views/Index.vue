<template>
  <div class="app-container">
    <div v-if="!isEmbed">
      <Aside />
    </div>
    <router-view />
  </div>
</template>

<script setup>
import Aside from '../components/Aside.vue';
import bus from '@/utils/bus';
import { ref, onMounted, onUnmounted } from 'vue';

const isEmbed = ref(false);

function changeEmbed(value) {
  isEmbed.value = value;
}

onMounted(() => {
  bus.on('toggle-embed', changeEmbed);
});

onUnmounted(() => {
  bus.off('toggle-embed', changeEmbed);
});
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
</style>
