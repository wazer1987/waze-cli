/*
 * @Description: 
 * @Author: wangzheng
 * @Date: 2023-01-29 16:29:26
 * @LastEditTime: 2023-01-30 09:46:47
 * @LastEditors: wangzheng
 */

const axios = require('axios')
axios.interceptors.response.use(res=>{
  return res.data
}, err=>{});
async function fetchRepoList() {
  // 这里用别人 就把改组织下的所有的项目列表都拉去回来了
  const data = await axios.get('https://api.github.com/orgs/zhu-cli/repos') 
  return data
}

async function fetchTagList(repo){
  return axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`)
}
module.exports = {
  fetchRepoList,
  fetchTagList
}