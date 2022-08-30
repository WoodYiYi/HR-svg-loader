import request from '@/utils/request'

/**
 * 登录接口封装
 * @param data
 */
export function login(data) {
  // 返回一个promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户资料接口
 * @param token
 */
export function getUserInfo(token) {
  return request({
    url: 'sys/profile',
    method: 'post'
  })
}

/**
 * 获取用户的基本信息
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

