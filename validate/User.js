import Base from './Base'

class User extends Base{
  login =  async(req, res, next) => {
    const { userName, password } = req.body;
    const arr = [
      {label: '账号', value: userName, rules: ['notnull', 'noChinese']},
      {label: '密码', value: password, rules: ['notnull']},
    ];
    const { success, message } = this.check(arr)
    if (!success) {
      res.json({
        code: 20301,
        success: false,
        message
      })
      return
    }
    next()
  }
  async userInfo (req, res, next) {
    next()
  }
  getRow = async(req, res, next) => {
    const { params: { ID } } = req;
    const arr = [ {label: 'ID', value: ID, rules: ['notnull']}];
    const { success, message } = this.check(arr)
    if (!success) {
      res.json({
        code: 20301,
        success: false,
        message
      })
      return
    }    
    next()
  }
}

export default new User()