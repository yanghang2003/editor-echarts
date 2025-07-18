// .prettierrc.cjs
module.exports = {
  printWidth: 120, // 指定编译器换行的行长
  tabWidth: 2, // 指定每个缩进空格数
  semi: true, // 在语句的末尾输入分号
  singleQuote: true, // 使用单引号而不是双引号
  trailingComma: 'none', // 在多行逗号分隔的句法结构中尽可能输入尾随逗号
  bracketSpacing: true, // 在对象字面量中的括号之间输入空格
  arrowParens: 'always', // 在唯一的箭头函数参数周围包含括号
  useTabs: false, // 使用制表符而不是空格缩进行
  ignorePath: '.prettierignore',
};