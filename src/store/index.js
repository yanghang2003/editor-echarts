import { createStore } from 'vuex'

//默认图表的数据定义在data文件夹下 逻辑为点击哪一个图表 就把对应的图表的数据格式先
//赋值到这里的editData中 形成一个初始图表 增删改查都是操作这里的editData,图表那里就负责监听这里的数据
//一旦发生变化执行渲染函数 渲染函数里有从这里再取值的逻辑 
export default createStore({
  state: {
    editData: '',
  },
  mutations: {
    setEditData(state, data) {
      state.editData = data
    },
  }
})
