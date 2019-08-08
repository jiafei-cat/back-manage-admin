import express from 'express'
import User from '../controller/User'
import ValidateUser from '../validate/User'
const router = express.Router()

/**
 * 登录
 * @api {POST} /api/user/login 登录
 * @apiDescription 用户登录
 * @apiName login
 * @apiParam (参数) {String} userName 账号
 * @apiParam (参数) {String} password 密码
 * @apiSampleRequest /api/user/login
 * @apiGroup User
 * @apiVersion 0.0.1
 */
router.post('/login', ValidateUser.login, User.login)
/**
 * 登出
 * @api {POST} /api/user/loginOut 登出
 * @apiDescription 用户登出
 * @apiName loginOut
 * @apiHeader {String} Authorization token
 * @apiSampleRequest /api/user/loginOut
 * @apiGroup User
 * @apiVersion 0.0.1
 */
router.post('/loginOut', User.loginOut)
/**
 * 获取当前用户信息
 * @api {get} /api/user/userInfo 获取当前用户信息
 * @apiDescription 获取当前用户信息
 * @apiName userInfo
 * @apiHeader {String} Authorization token
 * @apiSampleRequest /api/user/userInfo
 * @apiGroup User
 * @apiVersion 0.0.1
 */
router.get('/userInfo', User.userInfo)

export default router