import Base from './Base'
import UserModel from '../model/User'
import logModel from '../model/Log'
import Authority from './Authority'
import JWT from 'jsonwebtoken'
class User extends Base {
  // 登录
  login = async(req, res, next) => {
    const { body: { userName, password }} = req;
    let search = null;
    // 查询用户名密码是否正确, 以及为用户设置登录成功后的token
    // TODO: 登录比较用户信息和token存储的信息是否一致，不一致需要重新设置token
    try {
      search = await UserModel.getRow({get: { userName, password }})
      const data = search[0] ? JSON.parse(JSON.stringify(search[0])) : ''

      if (data) {
        // 清除返回的空值
        for (let key in data) {
          if (!data[key]) {
            delete data[key]
          }
        }

        data.type = 'admin'
        data[data.type + '_expire_time'] = new Date(+new Date() + 60 * 60 * 24 * 1 * 1000) // 重新登录则上次的失效 (测试期间设置为一天后失效)
        try {
          console.log({
            set: {
              [`${data.type}_token`]: JWT.sign(data, {}),
              [`${data.type}_expire_time`]: data[`data.type_expire_time`],
              [`${data.type}_ip`]: this.getClientIp(req),
              user_id: data.id
            },
            get: {
              user_id: data.id
            }
          })
          // Token过期了或者用户登录获取到的信息和之前token解析出来的不一样，则重新设置，否则不处理
          await Authority.setToken(data, {
            set: {
              [`${data.type}_token`]: JWT.sign(data, {}),
              [`${data.type}_expire_time`]: data[`data.type_expire_time`],
              [`${data.type}_ip`]: this.getClientIp(req),
              user_id: data.id
            },
            get: {
              user_id: data.id
            }
          })
        } catch (e) {
          console.log('error1')
          this.handleException(req, res, e)
          return
        }
      }
    } catch (e) {
      console.log('error')
      this.handleException(req, res, e)
      return
    }

    // 查询为空即用户信息不正确，不为空说明查询成功
    if (search.length === 0) {
      res.json({
        code: 20301,
        success: false,
        message: '账号或密码错误'
      })
    } else if (search[0].status === 0) {
      res.json({
        code: 20301,
        success: false,
        message: '当前账号已被停用'
      })
    } else {
      try {
        // 写入登录日志
        await logModel.writeLog({
          set: {
            origin: type,
            type: 1,
            title: '用户登录',
            desc: '',
            ip: this.getClientIp(req),
            create_user: search[0].id,
            create_time: new Date()
          }
        })
      } catch (e) {
        this.handleException(req, res, e)
      }
      try {
        token = await Authority.getToken({get: {user_id: data.id}})
      } catch (e) {
        this.handleException(req, res, e)
        return
      }
      res.json({
        code: 20000,
        success: true,
        content: {},
        token: token[0] ? token[0][data.type + '_token'] : '',
        message: '登录成功'
      })
    }
  }
  // 退出登录
  loginOut = async(req, res, next) => {
    let userInfo = await this.getUserInfo(req)
    // 设置Token过期时间为现在
    userInfo[req.query.type + '_expire_time'] = +new Date()
    try {
      // TODO: 测试期间不清除数据
      // await Authority.setToken(userInfo, {
      //   set: {[userInfo.type + '_token']: JWT.sign(userInfo, 'BBS', {}), user_id: userInfo.id}
      // })
    } catch (e) {
      this.handleException(req, res, e)
      return
    }
    try {
      let type = req.query.type === 'phone' ? 0 : req.query.type === 'bbs' ? 1 : 2
      // 写入登出日志
      await logModel.writeLog({
        set: {
          origin: type,
          type: 2,
          title: '用户登出',
          desc: '',
          ip: this.getClientIp(req),
          create_user: userInfo.id,
          create_time: new Date()
        }
      })
    } catch (e) {
      this.handleException(req, res, e)
    }
    res.json({
      code: 20000,
      success: true,
      content: {},
      message: '操作成功'
    })
  }
  // 获取用户信息
  userInfo = async(req, res, next) => {
    const userInfo = await this.getUserInfo(req),
          search = await UserModel.getRow({get: {id: userInfo.id, flag: 1}})
    if (search.length === 0) {
      res.json({
        code: 20401,
        success: false,
        content: search,
        message: '用户不存在'
      })
    } else {
      res.json({
        code: 20000,
        success: true,
        content: search,
        message: '操作成功'
      })
    }
  }
}

export default new User()