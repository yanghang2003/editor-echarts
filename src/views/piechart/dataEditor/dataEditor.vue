<template>
  <div class="data-editor">
    <div class="header">
      <h2>数据编辑</h2>
    </div>

    <div class="data-container">
      <!-- 表头 -->
      <div class="data-header">
        <div class="header-col select-col"><div class="one">选择</div></div>
        <div class="header-col"><div class="two">标签</div></div>
        <div class="header-col"><div class="three">数值</div></div>
        <div class="header-col select-col">颜色</div>
      </div>

      <!-- 数据行 -->
      <div v-for="(item, index) in seriesData" :key="index" class="data-row">
        <div class="row-col select-col">
          <input type="checkbox" v-model="selectedItems[index]" class="row-checkbox" />
        </div>
        <div class="row-col">
          <input type="text" v-model="item.name" class="text-input" />
        </div>
        <div class="row-col">
          <input type="number" v-model="item.value" class="number-input" />
        </div>
        <div class="row-col select-col">
          <input type="color" v-model="item.color" class="color-input" />
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="addDataItem" class="btn btn-add">添加数据项</button>
      <button @click="removeSelectedItems" class="btn btn-remove" :disabled="!hasSelectedItems">删除选中项</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const seriesData = computed(() => store.state.editData.seriesData);

const selectedItems = ref([]);

// 初始化选中状态数组
watch(
  () => seriesData.value, // 注意这里要加 .value
  (newData) => {
    selectedItems.value = new Array(newData.length).fill(false);
  },
  { immediate: true }
);

// 添加新数据项
const addDataItem = () => {
  const newName = `产品${String.fromCharCode(65 + store.state.editData.seriesData.length)}`;
  const newColor = `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

  const newEditData = [
    ...store.state.editData.seriesData,
    {
      name: newName,
      color: newColor,
      value: Math.floor(Math.random() * 20) + 5
    }
  ];
  store.commit('setEditData', {
    ...store.state.editData,
    seriesData: newEditData
  });
  selectedItems.value.push(false);
};
// 计算是否有选中的项
const hasSelectedItems = computed(() => {
  return selectedItems.value.some((item) => item === true);
});
// 删除选中项
const removeSelectedItems = () => {
  if (!hasSelectedItems.value) return;
  const newEditData = store.state.editData.seriesData.filter((_, index) => !selectedItems.value[index]);
  store.commit('setEditData', {
    ...store.state.editData,
    seriesData: newEditData
  });
  selectedItems.value = new Array(newSeriesData.length).fill(false);
};
</script>

<style>
.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.data-editor {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  padding: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
}
.one {
  margin-left: 12px;
}
.two {
  margin-left: 7px;
}
.three {
  margin-left: 2px;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.icon {
  margin-right: 8px;
  color: #4f46e5;
}

.header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.data-container {
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.data-header {
  display: flex;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.header-col {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.select-col {
  width: 48px;
  flex: none !important;
}

.data-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.3s ease;
}

.data-row:hover {
  background-color: #f9fafb;
}

.data-row:last-child {
  border-bottom: none;
}

.row-col {
  flex: 1;
  padding-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-checkbox {
  height: 16px;
  width: 16px;
  color: #4f46e5;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-left: 15%;
}

.text-input,
.number-input {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-input:focus,
.number-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.color-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  background: none;
  height: 32px;
  width: 32px;
  cursor: pointer;
  padding: 0;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 16px;
}

.btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-icon {
  margin-right: 8px;
}

.btn-add {
  background-color: #4f46e5;
}

.btn-add:hover {
  background-color: #4338ca;
}

.btn-remove {
  background-color: #ef4444;
}

.btn-remove:hover {
  background-color: #dc2626;
}
</style>
