<template>
  <div class="aside-container">
    <h2 class="menu-title">图表菜单</h2>
    <ul class="menu-list">
      <li
        v-for="route in routes"
        :key="route.name"
        class="menu-item"
        :class="{ active: isActive(route.name) }"
        @click="handleClick(route)"
      >
        {{ route.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
const router = useRouter();
const currentRoute = useRoute();

// 用于立即响应点击，避免延迟
const activeRouteName = ref(currentRoute.name);

// 监听路由变化，确保最终状态正确
watch(
  () => currentRoute.name,
  (newRouteName) => {
    activeRouteName.value = newRouteName;
  }
);

const routes = computed(() => {
  return router.options.routes.filter((route) => route.name && route.name !== 'home' && route.name !== 'addon');
});

// 检查当前路由是否激活
const isActive = (routeName) => {
  return activeRouteName.value === routeName;
};

// 处理点击事件
const handleClick = (route) => {
  // 消息提示框 这个是异步
  ElMessageBox.confirm('切换后本次编辑数据将丢失，是否切换', '注意', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('切换成功');
      // 先立即更新 activeRouteName（视觉上无延迟）
      activeRouteName.value = route.name;
      // 再跳转路由
      router.push({ path: route.path });
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
