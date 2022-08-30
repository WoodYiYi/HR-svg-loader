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
        // 如果没有id才表示当前用户资料没有获取过
        // async 函数所return的内容 用 await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成 同步
        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        router.addRoutes(routes) // 添加动态路由到路由表  铺路
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
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
