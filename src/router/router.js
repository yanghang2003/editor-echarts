import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'
import '../theme/nprogress.scss'
import { NextLoading } from '../utils/loading.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/barchart/Index.vue')
    },
    {
      path: '/barChart',
      name: '柱状图',
      component: () => import('../views/barchart/Index.vue')
    },
    {
      path: '/lineChart',
      name: '折线图',
      component: () => import('../views/linechart/Index.vue')
    },
    {
      path: '/pieChart',
      name: '饼图',
      component: () => import('../views/piechart/Index.vue')
    }
  ],
});

// 进度条配置
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.1
});

router.beforeEach((to, from, next) => {
  // 启动进度条
  NextLoading.start();
  NProgress.start();

  const container = document.querySelector('.container');
  if (container) {
    container.style.display = 'none'; // 隐藏 container 盒子
  }

  // 进度条快速加载到70%
  NProgress.set(0.7);

  // 设置一个延迟时间，在路由切换前等待1秒
  setTimeout(() => {
    // 慢慢加载到80%
    NProgress.set(0.8);

    // 再次设置延迟，使进度条快速加载到100%
    setTimeout(() => {
      NProgress.set(1);  // 快速加载到100%

      // 路由切换
      next();

      // 完成进度条加载
      NextLoading.done();
      NProgress.done();

    }, 100); // 100ms后快速加载到100%

  }, 300); // 300ms后慢慢加载到80%

});

router.afterEach(() => {
  // 确保进度条完成
  NProgress.done();
});
export default router;