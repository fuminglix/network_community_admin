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
export function listComment(query) {
  return request({
    url: '/admin/report/comment/list',
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

// 查询举报评论列表
export function getComment(id) {
  return request({
    url: '/admin/report/comment/' + id,
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

// // 修改分类
// export function updateArticle(data) {
//   return request({
//     url: '/admin/content/article',
//     method: 'put',
//     data: data
//   })
// }
