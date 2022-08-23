import NProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式
import router from '@/router'
import store from '@/store' // 引入store实例 等价于组件中的this.$store

// 不需要导出，只需要代码执行即可
// 前置守卫
// next是前置守卫必须执行的钩子 next必须执行
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果访问登录页
      next('/') // 跳转主页
    } else {
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      // 不在白名单
      next('/login')
    }
  }
  NProgress.done() // 手动关闭进度条
})

// 后置守卫

router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
