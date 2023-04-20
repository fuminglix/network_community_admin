import request from '@/utils/request'

// // 查询文章列表
// export function addArticle(data) {
//   return request({
//     url: '/admin/content/article',
//     method: 'post',
//     data: data
//   })
// }

// 查询文章列表
export function listArticle(query) {
  return request({
    url: '/admin/report/article/list',
    method: 'get',
    params: query
  })
}

// // 删除文章
// export function delArticle(id) {
//   return request({
//     url: '/admin/content/article/' + id,
//     method: 'delete'
//   })
// }

// 查询分类详细
export function getArticle(id) {
  return request({
    url: '/admin/report/article/' + id,
    method: 'get'
  })
}

// 处理举报内容
export function updateRecord(data) {
  return request({
    url: '/admin/report/handle',
    method: 'put',
    data: data
  })
}
