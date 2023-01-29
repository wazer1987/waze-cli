const path = require('path')
// 文件操作的第三方包 判断有没有文件夹 等
const fs = require('fs-extra')

// 提供命令行选择的库
const Inquirer = require('inquirer')
// 下面是创建项目


/**
 * 
 * @param {*} projectName  waze create xxx 中的xxx
 * @param {*} option  waze create xxx --force  会变成参数 {force:true}
 */

module.exports = async function (projectName,option) {
  // 拿到当前 命令行窗口运行的路径 
  const cwd = process.cwd()

  // 拿到当前命令行 执行的命令的 工程名称和路径
  const targetDir = path.join(cwd,projectName)
  // 判断一下是否已经存在当前名字一样的工程
  if(fs.existsSync(targetDir)){
    // 如果你命令行运行的参数是 --force 就把原来存在的删除
    if(option.force){
      // 删除原有的
      await fs.remove(targetDir)
    }else {
      // 告诉用户是否要覆盖 或者取消 就需要用到 inquirer 帮助用户做选择
      // actions 就是 choices 里面选中的 value值
      let {actions} = await Inquirer.prompt([
        {
          name:'actions',  // 命名返回值变量的名字
          type:'list', // 命令行以列表的形式提供选择
          message:'Target directory already exists Pick an action', // 消息提示
          // 下面就是命令行 输出的选择的命令 值的value
          choices:[
            {name:'Overwirte',value:'overwrite'},
            {name:'Cancel',value:'false'}            
          ]
        }
      ])
      console.log(actions,'===actions');
      // 如果选择了取消Cancel 那就是false 直接return
      if(!actions) {
        return
      }else {
        // 就重写目录
        console.log(`\r\nRemoving....`);
        await fs.remove(targetDir)
        console.log();
      }
    }
  }
  
}