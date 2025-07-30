// postcss.config.js
import cssnano from 'cssnano';

export default {
  plugins: [
    cssnano({ preset: 'default' }) // 或其他 PostCSS 插件
  ]
};
