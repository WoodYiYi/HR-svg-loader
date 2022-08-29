import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css

import * as filters from '@/filters' // 引入工具类
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives' // 全局指令
// 针对上面的引入语法  **`import *  as  变量`**
// 得到的是一个对象**`{ 变量1：对象1，变量2： 对象2 ...   }`**,
// 所以可以采用对象遍历的方法进行处理

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
import Component from '@/components'

Vue.use(Component) // 注册自己的插件

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
