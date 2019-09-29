import { Context } from 'koa'
import Router from 'koa-router'
import HomeCtl from '../controllers/home'

const router = new Router()

router.get('/', (ctx: Context) => {
  ctx.body = '<h1>hello world</h1>'
})

router.post('/upload', HomeCtl.upload)

module.exports = router
