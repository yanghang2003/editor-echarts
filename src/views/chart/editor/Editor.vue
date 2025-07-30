<template>
  <div class="card" v-if="store.state.editData.chartType === 'bar'">
    <div class="series-header">
      <h2>数据编辑</h2>
      <button @click="addSeries" class="btn btn-primary">添加数据</button>
    </div>

    <div class="series-Container">
      <div class="seriesContainer">
        <!-- 系列项目 -->
        <div v-for="(series, seriesIndex) in seriesData" :key="seriesIndex" class="series-item">
          <div class="series-items-header">
            <h3 class="series-items-title">数据{{ seriesIndex + 1 }}</h3>
            <button @click="removeSeries(seriesIndex)" class="btn btn-danger" :disabled="seriesData.length <= 1">
              删除
            </button>
          </div>
          <div class="form-group">
            <label class="form-label">数据名称</label>
            <input type="text" v-model="series.name" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">颜色</label>
            <input type="color" v-model="series.color" class="color-input" />
          </div>
          <div class="form-group">
            <label class="form-label">数据点</label>
            <div class="data-points">
              <div v-for="(point, pointIndex) in series.points" :key="pointIndex" class="data-point">
                <input type="text" v-model="point.label" placeholder="标签" class="form-input point-input"
                  :disabled="seriesIndex !== 0" />
                <input type="number" v-model="point.value" placeholder="数值" class="form-input point-input" />
                <button @click="removePoint(seriesIndex, pointIndex)" class="btn btn-danger"
                  :disabled="series.points.length <= 1">
                  删除
                </button>
              </div>
            </div>
            <button @click="addPoint(seriesIndex)" class="btn btn-text">添加数据点</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card" v-if="store.state.editData.chartType === 'line'">
    <div class="series-header">
      <h2>数据编辑</h2>
      <button @click="addSeries" class="btn btn-primary">添加数据</button>
    </div>

    <div class="series-Container">
      <div class="seriesContainer">
        <!-- 系列项目 -->
        <div v-for="(series, seriesIndex) in seriesData" :key="seriesIndex" class="series-item">
          <div class="series-items-header">
            <h3 class="series-items-title">数据{{ seriesIndex + 1 }}</h3>
            <button @click="removeSeries(seriesIndex)" class="btn btn-danger" :disabled="seriesData.length <= 1">
              删除
            </button>
          </div>
          <div class="form-group">
            <label class="form-label">数据名称</label>
            <input type="text" v-model="series.label" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">线框颜色</label>
            <input type="color" v-model="series.borderColor" class="color-input" />
          </div>
          <div class="form-group">
            <label class="form-label">背景颜色</label>
            <input type="color" :value="rgbaToHex(series.backgroundColor)" class="color-input"
              @input="(e) => handleColorInput(e, seriesIndex)" />
          </div>
          <div class="form-group">
            <label class="form-label">平滑度</label>
            <input type="number" v-model="series.tension" class="form-input" min="0" max="1" step="0.01" />
          </div>
          <div class="form-group">
            <label class="form-label">数据点</label>
            <div class="data-points">
              <div v-for="(point, pointIndex) in series.points" :key="pointIndex" class="data-point">
                <input type="text" v-model="point.label" placeholder="标签" class="form-input point-input"
                  :disabled="seriesIndex !== 0" />
                <input type="number" v-model="point.value" placeholder="数值" class="form-input point-input" />
                <button @click="removePoint(seriesIndex, pointIndex)" class="btn btn-danger"
                  :disabled="series.points.length <= 1">
                  删除
                </button>
              </div>
            </div>
            <button @click="addPoint(seriesIndex)" class="btn btn-text">添加数据点</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="data-editor" v-if="store.state.editData.chartType === 'pie'">
    <div class="header">
      <h2>数据编辑</h2>
    </div>

    <div class="data-container">
      <!-- 表头 -->
      <div class="data-header">
        <div class="header-col select-col">
          <div class="one">选择</div>
        </div>
        <div class="header-col">
          <div class="two">标签</div>
        </div>
        <div class="header-col">
          <div class="three">数值</div>
        </div>
        <div class="header-col select-col">颜色</div>
      </div>

      <!-- 数据行 -->
      <div v-for="(item, index) in seriesData" :key="index" class="data-row">
        <div class="row-col select-col">
          <input type="checkbox" v-model="methods.selectedItems[index]" @change="methods.toggleItemSelection(index)"
            class="row-checkbox" />
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
      <button @click="addSeries" class="btn btn-add">添加数据项</button>
      <button @click="removeSeries" class="btn btn-remove" :disabled="!hasSelectedItems">删除选中项</button>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { ChartDataEditor } from '@/utils/ChartDataEditor';

const store = useStore();
const chartType = computed(() => store.state.editData.chartType);
const seriesData = computed(() => store.state.editData.seriesData);
const editor = ref(null);
const methods = ref({});
const hasSelectedItems = computed(() => {
  return methods.value.selectedItems?.some(selected => selected) || false;
});

const rgbaToHex = (rgba) => {
  // 匹配 rgba 或 rgb 格式
  const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);

  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }

  return '#000000'; // 默认黑色
};
const handleColorInput = (e, seriesIndex) => {
  const hexColor = e.target.value;
  //将HEX转换为RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  //添加透明度0.1，生成rgba颜色
  const rgbaColor = `rgba(${r}, ${g}, ${b}, 0.1)`;

  const updatedSeriesData = [...seriesData.value];
  updatedSeriesData[seriesIndex] = {
    ...updatedSeriesData[seriesIndex],
    backgroundColor: rgbaColor
  };
  store.commit('setEditData', {
    ...store.state.editData,
    seriesData: updatedSeriesData
  });
};
// 初始化编辑器
const initEditor = () => {
  editor.value = new ChartDataEditor(store, chartType.value);
  methods.value = editor.value.getMethods();
  // 初始化饼图选中状态
  if (chartType.value === 'pie') {
    //新添加的独立属性 这里不是editor里的selectedItems 所有后续增删都要两边的操作一下手动同步
    methods.value.selectedItems = new Array(store.state.editData.seriesData.length).fill(false);
  }
};

// 监听图表类型变化
watch(chartType, () => {
  initEditor();
}, { immediate: true });

const addSeries = () => {
  if (chartType.value === 'pie') {
    methods.value.addItem();
  } else {
    methods.value.addSeries();
  }
};

const removeSeries = (index) => {
  if (chartType.value === 'pie') {
    methods.value.removeSelectedItems();
    methods.value.selectedItems = new Array(store.state.editData.seriesData.length).fill(false)
  } else {
    methods.value.removeSeries(index);
  }
};

function addPoint(seriesIndex) {
  methods.value.addPoint(seriesIndex);
}

function removePoint(seriesIndex, pointIndex) {
  methods.value.removePoint(seriesIndex, pointIndex);
}

</script>

<style scoped lang="scss">
//折线图和柱形图样式
.card {
  background-color: white;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;

  .series-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }


  .series-Container {
    height: 85vh;
    overflow-y: auto;

    .seriesContainer {
      margin-bottom: 20px;

      .series-items-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .btn-danger {
          color: #ef4444;
          background: none;
          border: none;
        }

        .btn-danger:hover {
          color: #dc2626;
        }

        .series-items-title {
          font-weight: 500;
          color: #374151;
        }
      }
    }

    .form-group {
      margin-top: 15px;

      .color-input {
        width: 100%;
        height: 2.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.25rem;
      }

      .form-input {
        width: calc(100% - 30px);
        padding: 0.5rem 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 1rem;
        line-height: 1.5;
        margin-left: 2px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }

      .form-input:focus {
        outline: none;
        margin-left: 2px;
        border-color: #a5b4fc;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
      }

      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
      }

      .data-points {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .data-point {
          display: flex;
          align-items: center;
          margin-left: 2px;
          gap: 0.5rem;

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .btn-danger {
            color: #ef4444;
            background: none;
            border: none;
          }

          .btn-danger:hover {
            color: #dc2626;
          }

          .form-input {
            width: calc(100% - 30px);
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
            line-height: 1.5;
            margin-left: 2px;
            transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          }

          .form-input:focus {
            outline: none;
            margin-left: 2px;
            border-color: #a5b4fc;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
          }

          .point-input {
            flex: 1;
            max-width: 33%;
          }
        }
      }

      .btn-text {
        color: var(--text);
        background: none;
        border: none;
        font-size: 0.875rem;
      }

      .btn-text:hover {
        color: var(--text-hover);
      }

    }
  }

  .btn-primary {
    background-color: var(--primary);
    color: white;
    border: none;
  }

  .btn-primary:hover {
    background-color: var(--primary-hover);
  }
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

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
//饼图样式
.data-editor {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  padding: 24px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .data-container {
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;

    .data-header {
      display: flex;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
      background-color: #f9fafb;

      .header-col {
        flex: 1;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;

        .one {
          margin-left: 12px;
        }

        .two {
          margin-left: 7px;
        }

        .three {
          margin-left: 2px;
        }
      }

      .select-col {
        width: 48px;
        flex: none !important;
      }
    }

    .data-row {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
      transition: background-color 0.3s ease;

      .row-col {
        flex: 1;
        padding-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;

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
      }

      .select-col {
        width: 48px;
        flex: none !important;
      }

      .data-row:hover {
        background-color: #f9fafb;
      }

      .data-row:last-child {
        border-bottom: none;
      }
    }
  }

  .actions {
    display: flex;
    gap: 20px;
    margin-top: 16px;



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
  }
}

.data-editor:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
