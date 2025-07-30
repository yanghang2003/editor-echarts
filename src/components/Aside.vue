<template>
  <div class="aside-container">
    <h2 class="menu-title">图表菜单</h2>
    <ul class="menu-list">
      <li
        v-for="item in chartList"
        :key="item.name"
        class="menu-item"
        :class="{ active: isActive(item.type) }"
        @click="handleClick(item.type)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { useStore } from 'vuex';
import { chooseDefaultChartData } from '@/utils/chooseDefaultChartData';

const store = useStore();

const chartList = [{
    name:'柱状图',
    type:'bar'
  },
  {
    name:'折线图',
    type:'line'
  },
  {
    name:'饼图',
    type:'pie'
  }
]
const isActive = (type) =>{
  return store.state.type === type
}

// 处理点击事件
const handleClick = (type) => {
  
  if(store.state.type == type) return;
  ElMessageBox.confirm('切换后本次编辑数据将丢失，是否切换', '注意', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      store.commit('setType', type);
      //切换后保留上次数据就不要深拷贝 不保留就下下句代码
      /* store.commit('setEditData', chooseDefaultChartData(store.state.type)); */
      if(!(store.state.type == store.state.editData.chartType)){
        store.commit('setEditData', JSON.parse(JSON.stringify(chooseDefaultChartData(store.state.type))) );
      }
     
      ElMessage.success('切换成功');
    })
    .catch(() => {
      ElMessage.info('取消操作');
    });
};
</script>

<style scoped>
.aside-container {
  width: 200px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.menu-title {
  padding: 20px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 1px solid #34495e;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #34495e;
}

.menu-item.active {
  background-color: var(--primary);
  color: white;
}
</style>
