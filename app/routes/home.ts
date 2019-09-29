import { Context } from 'koa'

import Router from 'koa-router'
const router = new Router()

router.get('/', (ctx: Context) => {
  ctx.body = '<h1>hello world</h1>'
})

module.exports = router
