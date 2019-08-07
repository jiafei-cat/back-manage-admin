import chalk from 'chalk';
import path from 'path';
import config from 'config-lite'; // 配置中间件
import express from 'express';
import bodyParser from 'body-parser';
import history from 'connect-history-api-fallback';

const app = express();

app.disable('etag') // 禁止304缓存

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || req.headers.referer || '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', true) // 可以带cookies
  res.header('Access-Control-Max-Age', -1) // 本次预检请求的有效期, 一小时内不重复检验
  res.header('X-Powered-By', 'Express')
  if (req.method === 'OPTIONS') { // 跨域复杂请求验证
    res.sendStatus(200)
  } else {
    next()
  }
})

// 解析body参数
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// router(app)
app.use(history())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', (res) => {
  console.log(res)
})
app.listen('1313', () => {
  console.log(
		chalk.green(`listen on port 1313`)
	)
})
