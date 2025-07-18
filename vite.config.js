import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'], // 自动导入的依赖库数组
      dts: true // 生成自动导入的类型声明文件
    })
  ],
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/') // 设置@别名指向src目录
    }
  }
})
