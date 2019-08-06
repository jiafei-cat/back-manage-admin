/**
 * 路由中间件
 * 第一层验证Token
 * 第二层验证用户是否有操作权限
 * 第三层验证参数, 验证成功后再进行事件处理
 */
export default app => {
    // 图表数据
    app.use('/api/charts', Authority.checkToken, Authority.permissions, charts);
}
  