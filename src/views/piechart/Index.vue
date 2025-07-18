<template>
  <div class="container">
    <button class="toggle-editor-btn" @click="toggleEditor">
      {{ isEditorOpen ? '►' : '◄' }}
    </button>
    <div class="grid-container" :class="{ 'editor-open': isEditorOpen }">
      <ChartDisplay />
      <DataEditor v-show="isEditorOpen" />
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import DataEditor from './dataEditor/dataEditor.vue';
import ChartDisplay from './chartDisplay/ChartDisplay.vue';
import bus from '../../utils/bus';
import { DEFAULT_PIE_CHART_DATA } from '../../data/pie';

//一进入这个页面就把扇图初始数据赋值给store
const store = useStore();
const newPieConfig = JSON.parse(JSON.stringify(DEFAULT_PIE_CHART_DATA));
store.commit('setEditData', newPieConfig);

//编辑器是否打开的变量
const isEditorOpen = ref(false);
const toggleEditor = () => {
  isEditorOpen.value = !isEditorOpen.value;
  bus.emit('toggle-editor');
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  .grid-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0fr);
    height: 100%;
    transition: grid-template-columns 0.3s ease;
  }

  .grid-container.editor-open {
    /* 展开时各占50%，但限制最小宽度为0 */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
  .toggle-editor-btn {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    width: 30px;
    height: 60px;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 5px 0 0 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
}
</style>
