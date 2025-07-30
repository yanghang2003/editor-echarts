<template>
  <div></div>
</template>

<script setup>
import { useStore } from 'vuex';
import { AddonChild } from '@cqupt-hub/addon';
import { useRoute, useRouter } from 'vue-router';
import { chooseDefaultChartData } from '@/utils/chooseDefaultChartData';

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
        console.log(graph)
        if(graph.seriesData){
          store.commit('setEditData', graph);
          console.log(store.state.editData)
        }else{
          console.log(chooseDefaultChartData('bar'));
          store.commit('setEditData', JSON.parse(JSON.stringify(chooseDefaultChartData('bar'))));
          console.log(store.state.editData)
        }
        
        let type = graph.chartType?graph.chartType:'bar';
        store.commit('setType', type);
        router.push('/chart');
      } catch (err) {
        console.log(err);
      }
    });
  });
});
</script>
