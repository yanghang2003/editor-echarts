<template>
  <div class="container">
    <div v-show="showTriangle">
      <button class="toggle-editor-btn" @click="changeToEditor">
        {{ isEditorOpen ? '►' : '◄' }}
      </button>
    </div>

    <div class="grid-container" :class="{ 'editor-open': isEditorOpen }">
      <!-- 图表展示组件 -->
      <Display />
      <!-- 图表编辑组件 -->
      <Editor v-show="isEditorOpen" />
    </div>
  </div>
</template>

<script setup>
import Display from './display/Display.vue';
import Editor from './editor/Editor.vue';
import bus from '@/utils/bus';
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

//编辑器是否打开的变量
const isEditorOpen = ref(false);

//控制三角形的显示 就是在右中间的那个button
const showTriangle = ref(false);

const changeToEditor = () => {
  isEditorOpen.value = !isEditorOpen.value;
  // 通知编辑组件中的x轴和y轴和标题是否展示
  bus.emit('toggle-editor');
};
// 监听 store.state.showEdit 的变化
watch(
  () => store.state.showEdit,
  (newValue) => {
    showTriangle.value = newValue;
  },
  { immediate: true }
);
onMounted(() => {
  bus.on('close-editor', (value) => {
    isEditorOpen.value = value;
  });
});
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
