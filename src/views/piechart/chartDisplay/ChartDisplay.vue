<template>
  <div class="card">
    <div class="form-group" v-show="isEmbed">
      <label for="chartTitle" class="form-label">图表标题</label>
      <input type="text" id="chartTitle" v-model="chartTitle" class="form-input" />
    </div>
    <div class="chart-display" :style="{ height: isEmbed ? 'calc(100vh - 350px)' : '400px' }">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import bus from '../../../utils/bus';
import { useStore } from 'vuex';

const store = useStore();
const isEmbed = ref(false);

const chartTitle = computed({
  get: () => store.state.editData?.option?.plugins?.title?.text || '默认标题',
  set: (value) => {
    // 正确写法：保持嵌套结构，仅修改目标属性
    const newEditData = {
      ...store.state.editData,
      option: {
        ...store.state.editData.option,
        plugins: {
          ...store.state.editData.option.plugins,
          title: {
            ...store.state.editData.option.plugins.title,
            text: value // 只修改 text 字段
          }
        }
      }
    };
    store.commit('setEditData', newEditData);
  }
});

// 图表引用
const chartCanvas = ref(null);
let chart = null;

// 初始化图表
const initChart = () => {
  if (chartCanvas.value) {
    chart = new Chart(chartCanvas.value.getContext('2d'), {
      type: store.state.editData.chartType,
      data: getChartData(),
      options: store.state.editData.option
    });
  }
};
// 获取图表数据
const getChartData = () => {
  const labels = store.state.editData.seriesData.map((item) => item.name);
  const datasets = [
    {
      data: store.state.editData.seriesData.map((item) => item.value),
      backgroundColor: store.state.editData.seriesData.map((item) => item.color),
      borderWidth: 1
    }
  ];

  return {
    labels,
    datasets
  };
};

// 更新图表
const updateChart = () => {
  if (chart) {
    chart.data = getChartData();
    chart.options = store.state.editData.option;
    chart.update();
  }
};

// 监听数据变化
watch(() => chartTitle, updateChart, { deep: true });
watch(() => store.state.editData.seriesData, updateChart, { deep: true });

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
  bus.on('toggle-editor', () => {
    isEmbed.value = !isEmbed.value;
  });
});
</script>

<style scoped lang="scss">
.card {
  padding: 3rem;
  transition: all 0.3s ease;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .chart-display {
    width: 100%;
    position: relative;
    flex-grow: 1;
    transition: height 0.3 ease;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-input {
  width: calc(100% - 27px);
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #a5b4fc;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}
</style>
