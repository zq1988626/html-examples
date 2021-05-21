import DefaultTheme from 'vitepress/theme'
import  testC from "./test.vue"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('testC', testC)
  }
}