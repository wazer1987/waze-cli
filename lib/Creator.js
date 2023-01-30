
const { fetchRepoList,fetchTagList } = require("./request")
const Inquirer = require('inquirer')
// 用来在命令行显示转圈的loading
const ora = require('ora')
const util = require('util')
// 下载代码的包 不支持promise 所以使用node自带的util包把他转换成peomise
const downloadGitRepo = require('download-git-repo')



/**
 * 
 * @param {*} fn 拉取git下的项目列表函数
 * @param {*} message  // 拉取过程中的的提示消息 
 */

// 失败函数
async function sleep(n){
  return new Promise((resolve,reject)=> {
    setTimeout(resolve,n)
  })
}

 async function warpLoading(fn,message,...arg) {
  const spinner = ora(message)
  spinner.start()
  try {
    let repos= await fn(...arg)
    spinner.succeed()
    return repos
  } catch (error) {
      spinner.fail('request failed, refetch...')
      await sleep(1000)
      return warpLoading(fn,message)
  }
  
}

/**
 * 
 * @param {*} name  要创建的项目名称
 * @param {*} path  要创建的项目路径
 */

class Creator {
  constructor(name,path) {
    this.name = name
    this.path = path
    // 这个方法 会把函数转换成promise
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 拉去组织下的项目列表
  async fetchRepo() {
    // 拿到了项目列表
    let repos = await warpLoading(fetchRepoList,'wating fetch template')
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
    return repo
  }


  // 根据选择的项目去拉去 改项目所有的标签
  async fetchTag(repo) {
    let tags = await warpLoading(fetchTagList,'waiting fetch tag',repo)
    if(!tags) return
    tags = tags.map(item => item.name)
    let {tag} = await Inquirer.prompt({
      name:'tag',
      type:'list',
      // 选项就是我们的名称
      choices:tags,
      message:'please choice a template to creatr project'
    })
    return tag
  }

  // 下载
  async download(repo,tag) {
    // 拼接下载路径
    let requestUrl = `zhu-cli/${repo}/${tag?'#'+tag:''}`
    // 下载地址 和下载的路径
    await this.downloadGitRepo(requestUrl,this.path)

    return this.path
  }

  // 创建 项目
  async create() {
    //1 要拉取当前账号下的组织 返回是一个github类似的项目列表
    // 这里拿到repo 就是 选择的项目名称
    let repo = await this.fetchRepo()

    // 2. 找到组织下的模板 根据模板名称拉去 当前模板的标签
    // 拿到的tag 就是 根据选择的项目名称 拿到tag
    let tag = await this.fetchTag(repo)

    // 3. 下载项目
    await this.download(repo,tag)
  }

}
module.exports = Creator