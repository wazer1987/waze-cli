const { fetchRepoList } = require("./request")
const Inquirer = require('inquirer')

/**
 * 
 * @param {*} name  要创建的项目名称
 * @param {*} path  要创建的项目路径
 */

class Creator {
  constructor(name,path) {
    this.name = name
    this.path = path
  }

  // 拉去组织下的项目列表
  async fetchRepo() {
    // 拿到了项目列表
    let repos = await fetchRepoList()
    // 如果没有项目直接退出
    if(!repos) return
    // 便利项目的 项目名称
    repos = repos.map( item => item.name)
    // 开始让绘制选择框 让用户选择
    let {repo} = await Inquirer.prompt({
      name:'repo',
      type:'list',
      // 选项就是我们的名称
      choices:repos,
      message:'please choice a template to creatr project'
    })
    return repos
  }


  // 根据选择的项目去拉去 改项目所有的标签
  async fetchTag(repo) {

  }

  // 下载
  async download() {

  }

  // 创建 项目
  async create() {
    //1 要拉取当前账号下的组织 返回是一个github类似的项目列表
    let repo = await this.fetchRepo()

    // 2. 找到组织下的模板 根据模板名称拉去 当前模板的标签
    let tag = await this.fetchTag(repo)

    // 3. 下载项目
    await this.download(repo,tag)
  }

}
module.exports = Creator