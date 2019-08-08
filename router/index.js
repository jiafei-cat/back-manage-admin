import Authority from '../controller/Authority';
import user from './user';
/**
 * 路由中间件
 * 第一层验证Token
 * 第二层验证用户是否有操作权限 - 暂时不做处理
 * 第三层验证参数, 验证成功后再进行事件处理
 */
export default app => {
    // 图表数据
    app.use('/api/user', Authority.checkToken, user);
}
  