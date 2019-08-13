import query from '../mysql'
import Base from './Base'
import JWT from 'jsonwebtoken'

class Token extends Base{
  // 获取token
  getToken = async(obj) => {
    let sql = `select * from token where 1 = 1 ${this.joinStr('get', obj.get)};`
    return query(sql)
  }
  // 设置token
  setToken = async(data, obj) => {
    let search, sql, newUserInfo = {...data}, oldUserInfo = {}
    try {
      // 获取该用户的该用户的token
      search = await this.getToken({get: {userId: data.id}})
    } catch (e) {
      return e
    }
    // 用户不存在则创建一条数据，存在则将原来的token替换掉
    if (search.length === 0) {
      sql = `INSERT INTO token set ${this.joinStr('set', obj.set)};`
    } else {
      // 解析token和当前数据做对比
      JWT.verify(search[0][`${data.type}Token`], 'admin', (error, decoded) => {
        if (error) {
          return {}
        }
        oldUserInfo = decoded
      })
      // 用户数据发生变化，重新设置数据信息，只修改token
      if (JSON.stringify(newUserInfo) !== JSON.stringify(oldUserInfo)) {
        // 两边数据不一致更新token
        obj.set = { [data.type + 'Token']: obj.set[data.type + 'Token'] }
        sql = `UPDATE token set ${this.joinStr('set', obj.set)} where 1 = 1 ${this.joinStr('get', obj.get)};`
      } else {
        // 相同就更新token
        sql = `UPDATE token set ${this.joinStr('set', obj.set)} where 1 = 1 ${this.joinStr('get', obj.get)};`
      }
    }
    return sql ? query(sql) : ''
  }
}

export default new Token()