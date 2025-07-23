<!-- 项目启动先进入一个空白页面 
在这个空白页面获取路由id 
根据id初始化addon获取数据 
如果有数据就赋值到页面 
如果没有就什么都不做 
然后根据仓库里的type类型字段 
获取到图表类型 
跳转到对应的路由下 
如果没有 
就默认跳转到柱形图也就是首图
然后在图表展示组件的初始化数据的时候判断 
如果仓库里有数据并且数据的type字段类型与自己写的初始化的数据的type字段相同就用仓库的 
如果不是就把自己写的数据赋值给仓库   
这里就是空白页面
它的使命就是为了获取从父页面获取的数据并赋值到仓库
然后他就可以销毁了 -->

<template>
  <div></div>
</template>

<script setup>
import { useStore } from 'vuex';
import { AddonChild } from '@cqupt-hub/addon';
import { useRoute, useRouter } from 'vue-router';

function match(type) {
  if (type === 'bar') {
    return '/barchart';
  }
  if (type === 'line') {
    return '/linechart';
  }
  if (type === 'pie') {
    return '/piechart';
  }
  console.error('未知的图表类型 (不管了先跳转到柱形图了):', type);
  return '/barchart';
}

const store = useStore();
const route = useRoute();
const router = useRouter();
const addon = new AddonChild({ timeout: 10000, super_course_id: route.params.id });

store.commit('setId', route.params.id);
onMounted(() => {
  addon.startListen();
  addon.request('loaded').then(({ data }) => {
    addon.request('data-get').then(({ data }) => {
      try {
        const graph = JSON.parse(data.data);
        store.commit('setEditData', graph);
        if (store.state.editData.chartType) {
          router.push(match(store.state.editData.chartType));
        } else {
          //默认跳转到柱形图
          router.push('/barchart');
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
});
</script>
