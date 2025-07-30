<template>
  <div class="card">
    <div class="form-group" v-show="isEmbed">
      <label for="chartTitle" class="form-label">图表标题</label>
      <input type="text" id="chartTitle" v-model="chartTitle" class="form-input" />
    </div>
    <div class="form-group" v-show="isEmbed && store.state.type !== 'pie'">
      <label for="xAxisLabel" class="form-label">X轴标签</label>
      <input type="text" id="xAxisLabel" v-model="xAxisLabel" class="form-input" />
    </div>
    <div class="form-group" v-show="isEmbed && store.state.type !== 'pie'">
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
import { useStore } from 'vuex';
import { AddonChild } from '@cqupt-hub/addon';
import { json2file } from '@/utils/file';
import bus from '@/utils/bus';
import { ChartHelper } from '@/utils/chartHelp';

const store = useStore();

let addon = new AddonChild({ timeout: 10000, super_course_id: store.state.id });
//处理全屏
function onFullscreen({ e, data }) {
  //控制侧边栏的显示 全屏时让其显示
  bus.emit('showAside', true);
  //控制三角形的显示 全屏时让其显示
  store.commit('setShowEdit', true);
  console.log(store.state.showEdit);
}
//处理退出全屏
function onExitFullscreen({ e, data }) {
  //让侧边栏不显示
  bus.emit('showAside', false);
  //让三角形不显示
  store.commit('setShowEdit', false);
  //让本组件的x轴标签和y轴标签和标题的编辑盒子不显示
  isEmbed.value = false;
  // 让编辑组件不显示
  bus.emit('close-editor', false);
  addon.succeed(e);
}
//处理数据获取事件
function onDataGet({ e, data }) {
  let state = store.state.editData;
  let file = json2file(state, addon.super_course_id + '.json');
  if (file.size > 20 * 1024 * 1024) {
    ElMessage.error('文件超过最大限度：20MB');
    addon.failed(e, { message: '文件超过最大限度：20MB' });
    return;
  }
  console.log('文件大小', file);
  console.log('文件内容', state);
  addon.succeed(e, { data: { file: file } });
}

onMounted(() => {
  addon.addEventListener('fullscreen', onFullscreen);
  addon.addEventListener('exit-fullscreen', onExitFullscreen);
  addon.addEventListener('data-get', onDataGet);
  addon.startListen();
  initChart();
  // 控制图表标题 x轴标签和y轴标签的显示
  bus.on('toggle-editor', () => {
    isEmbed.value = !isEmbed.value;
  });
});
onBeforeUnmount(() => {
  addon.removeEventListener('fullscreen', onFullscreen);
  addon.removeEventListener('exit-fullscreen', onExitFullscreen);
  addon.removeEventListener('data-get', onDataGet);
  bus.off('toggle-editor', () => {
    isEmbed.value = !isEmbed.value;
  });
});

//-----------------------------------下面是业务逻辑上面是通信逻辑-------------------------------------
//挂载的画布
const chartCanvas = ref(null);
//是否是编辑模式的变量 
const isEmbed = ref(false);
//类
let chartHelper = null;
//isTypeChanging变量明确区分类型切换和数据更新
let isTypeChanging = false;
//防抖
let updateTimer = null;

// 初始化图表
const initChart = () => {
  if (!chartCanvas.value) return;
  if (chartHelper) {
    chartHelper.destroy();
  }
  console.log(store.state.editData)
  // 创建新的图表助手实例
  chartHelper = new ChartHelper(
    chartCanvas.value,
    store.state.type,
    store.state.editData
  );
  console.log(chartHelper);
};


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
          ...store.state.editData.option.scales,
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

const debouncedUpdateChart = () => {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    chartHelper.updateData(store.state.editData)
  }, 100);
};
watch(() => store.state.editData.seriesData, () => {
  if (!isTypeChanging) {
    debouncedUpdateChart();
  }
}, { deep: true });
/* watch(() => store.state.editData.option, ()=>{debouncedUpdateChart(),console.log('option')}, { deep: true}); */

//按左边侧边栏的变换
watch(() => store.state.type, (newType) => {
  if (chartHelper && newType !== chartHelper.type) {
    isTypeChanging = true;
    initChart();
    setTimeout(() => isTypeChanging = false, 200);
  }
});

</script>

<style scoped lang="scss">
.card {
  padding: 1.5rem;
  transition: all 0.3s ease;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .form-group {
    margin-bottom: 1rem;

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
  }

  .chart-container {
    width: 100%;
    position: relative;
    flex-grow: 1;
    transition: height 0.3s ease;
  }
}
</style>
