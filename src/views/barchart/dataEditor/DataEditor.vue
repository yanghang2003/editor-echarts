<template>
  <div class="card">
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
                <input
                  type="text"
                  v-model="point.label"
                  placeholder="标签"
                  class="form-input point-input"
                  :disabled="seriesIndex !== 0"
                />
                <input type="number" v-model="point.value" placeholder="数值" class="form-input point-input" />
                <button
                  @click="removePoint(seriesIndex, pointIndex)"
                  class="btn btn-danger"
                  :disabled="series.points.length <= 1"
                >
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
</template>

<script setup>
import { useStore } from 'vuex';
import { getRandomColor } from '@/utils/getRandomColor';
const store = useStore();
const seriesData = computed(() => store.state.editData.seriesData);
function addPoint(seriesIndex) {
  const newPoint = { label: '', value: 0 };

  // 保持完整的嵌套结构
  const newEditData = {
    ...store.state.editData,
    seriesData: store.state.editData.seriesData.map((series, index) => {
      if (index === seriesIndex) {
        return {
          ...series,
          points: [...series.points, newPoint] // 创建新数组添加点
        };
      }
      return series;
    })
  };
  store.commit('setEditData', newEditData);
}
function removePoint(seriesIndex, pointIndex) {
  const newEditData = {
    ...store.state.editData,
    seriesData: store.state.editData.seriesData.map((series, index) => {
      if (index === seriesIndex) {
        const newPoints = [...series.points];
        newPoints.splice(pointIndex, 1);
        return {
          ...series,
          points: newPoints
        };
      }
      return series;
    })
  };
  store.commit('setEditData', newEditData);
}
function addSeries() {
  const templatePoints = seriesData.value[0]?.points || [];
  const newSeries = {
    name: `产品${String.fromCharCode(65 + store.state.editData.seriesData.length)}`,
    color: getRandomColor(),
    points: templatePoints.map((point) => ({
      label: point.label,
      value: 0
    }))
  };
  const newEditData = {
    ...store.state.editData,
    seriesData: [...store.state.editData.seriesData, newSeries]
  };

  store.commit('setEditData', newEditData);
}
function removeSeries(seriesIndex) {
  const newEditData = {
    ...store.state.editData,
    seriesData: store.state.editData.seriesData.filter((item, index) => index !== seriesIndex)
  };
  store.commit('setEditData', newEditData);
}
</script>

<style scoped lang="scss">
.card {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
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
        .series-items-title {
          font-weight: 500;
          color: #374151;
        }
      }
    }
    .form-group {
      margin-top: 15px;
      .form-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.25rem;
      }
    }
  }
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.color-input {
  width: 100%;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.25rem;
}

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

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
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

.btn-danger {
  color: #ef4444;
  background: none;
  border: none;
}

.btn-danger:hover {
  color: #dc2626;
}

.data-points {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.data-point {
  display: flex;
  align-items: center;
  margin-left: 2px;
  gap: 0.5rem;
}

.point-input {
  flex: 1;
  max-width: 33%;
}

[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
