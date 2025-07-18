<template>
  <div class="card">
    <div class="form-group" v-show="isEmbed">
      <label for="chartTitle" class="form-label">图表标题</label>
      <input type="text" id="chartTitle" v-model="chartTitle" class="form-input" />
    </div>
    <div class="form-group" v-show="isEmbed">
      <label for="xAxisLabel" class="form-label">X轴标签</label>
      <input type="text" id="xAxisLabel" v-model="xAxisLabel" class="form-input" />
    </div>
    <div class="form-group" v-show="isEmbed">
      <label for="yAxisLabel" class="form-label">Y轴标签</label>
      <input type="text" id="yAxisLabel" v-model="yAxisLabel" class="form-input" />
    </div>
    <div class="chart-container" :style="{ height: isEmbed ? 'calc(100vh - 350px)' : '400px' }">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
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

const xAxisLabel = computed({
  get: () => store.state.editData?.option?.scales?.x?.title?.text || '默认X轴标签',
  set: (value) => {
    const newEditData = {
      ...store.state.editData,
      option: {
        // 补全 option 层级
        ...store.state.editData.option,
        scales: {
          ...store.state.editData.option.scales, // 注意这里是 option.scales
          x: {
            ...store.state.editData.option.scales.x,
            title: {
              ...store.state.editData.option.scales.x.title,
              text: value // 修改 x 轴的 title.text
            }
          }
        }
      }
    };
    store.commit('setEditData', newEditData);
  }
});

const yAxisLabel = computed({
  get: () => store.state.editData?.option?.scales?.y?.title?.text || '默认Y轴标签',
  set: (value) => {
    const newEditData = {
      ...store.state.editData,
      option: {
        // 补全 option 层级
        ...store.state.editData.option,
        scales: {
          ...store.state.editData.option.scales, // 注意这里是 option.scales
          y: {
            ...store.state.editData.option.scales.y,
            title: {
              ...store.state.editData.option.scales.y.title,
              text: value // 修改 y 轴的 title.text
            }
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
  const labels = store.state.editData.seriesData[0]?.points?.map((point) => point.label) || [];

  const datasets = store.state.editData.seriesData.map((series) => ({
    label: series.name,
    data: series.points.map((point) => point.value),
    backgroundColor: series.color,
    borderColor: series.color,
    borderWidth: 1
  }));

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
watch(() => [chartTitle, xAxisLabel, yAxisLabel], updateChart, { deep: true });
watch(() => store.state.editData.seriesData, updateChart, { deep: true });

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
  bus.on('toggle-editor', () => {
    isEmbed.value = !isEmbed.value;
  });
});
</script>

<style scoped>
.card {
  padding: 1.5rem;
  transition: all 0.3s ease;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chart-container {
  width: 100%;
  position: relative;
  flex-grow: 1;
  transition: height 0.3s ease;
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
