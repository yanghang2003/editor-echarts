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
  },
  build: {
    outDir: 'dist', // 打包输出目录
    chunkSizeWarningLimit: 500, // 代码分包阈值
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 删除 console
        drop_debugger: true, // 删除 debugger
      },
      format: {
        comments: false // 删除所有注释
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,// 设置入口文件输出名称
        chunkFileNames: `assets/[name].[hash].js`,// 设置分割后的代码块文件名称
        assetFileNames: `assets/[name].[hash].[ext]`,// 设置静态资源文件名称
        compact: true, // 启用输出文件压缩
        manualChunks: { // 手动分割代码
          vue: ['vue', 'vue-router'],
          echarts: ['chart.js'],
        },
      },
    },
  },
})
