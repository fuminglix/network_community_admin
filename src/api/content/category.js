import request from '@/utils/request'
import downloadService from '@/utils/downloadService'

// 查询分类列表
export function listCategory(query) {
  return request({
    url: '/admin/content/category/list',
    method: 'get',
    params: query
  })
}

// 查询分类列表
export function listAllCategory() {
  return request({
    url: '/admin/content/category/listAllCategory',
    method: 'get'
  })
}
// 查询分类详细
export function getCategory(id) {
  return request({
    url: '/admin/content/category/' + id,
    method: 'get'
  })
}

// 新增分类
export function addCategory(data) {
  return request({
    url: '/admin/content/category',
    method: 'post',
    data: data
  })
}

// 修改分类
export function updateCategory(data) {
  return request({
    url: '/admin/content/category',
    method: 'put',
    data: data
  })
}

// 删除分类
export function delCategory(id) {
  return request({
    url: '/admin/content/category/' + id,
    method: 'delete'
  })
}

// 导出分类
export function exportCategory() {
  return downloadService({
    url: '/admin/content/category/export',
    method: 'get'
  })
}

// 分类状态修改
export function changeCategoryStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/admin/content/category/changeStatus',
    method: 'put',
    data: data
  })
}
