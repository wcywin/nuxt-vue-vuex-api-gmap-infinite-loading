module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'no-unused-expressions': 'off',
    'template-curly-spacing': 'off',
    'indent': 'off',
    'vue/script-indent': ['error', 2, {
      'baseIndent': 1
    }]
  }
}
