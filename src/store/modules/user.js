import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { getUserDetailById, getUserInfo, login } from '@/api/user'

// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
// Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
const state = {
  token: getToken(), // 设置token初始状态
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}

// 修改状态
const mutations = {

  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据
    setToken(token)
  },

  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },

  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }
  },

  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {

  // 定义login action 需要参数 调用action 传递过来的参数
  async login(context, data) {
    const result = await login(data)// 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 写入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存
  },

  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // result就是用户的基本资料
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 提交mutations
    // 加一个点睛之笔  这里这一步，暂时用不到，但是请注意，这给我们后边会留下伏笔
    return baseResult
  },

  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}