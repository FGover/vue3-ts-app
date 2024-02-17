/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  // 添加ESlint规则
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, // 单引号
        semi: false, // 没有分号
        printWidth: 100, // 每行超过100字符， 自动换行
        trailingComma: 'none', // 没有对象数组最后一个逗号
        endOfLine: 'auto' // 自动添加换行符
      }
    ],
    'vue/multi-word-component-names': [
      'warn',
      {
        // vue 组件需要大驼峰命名，除去 index 之外，App 是默认支持的
        ignores: ['index']
      }
    ],
    // 允许对 props 进行解构，我们会开启解构保持响应式的语法糖
    'vue/no-setup-props-destructure': ['off']
  }
}
