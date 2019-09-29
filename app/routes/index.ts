import Koa from 'koa'
import fs from 'fs'
import Router from 'koa-router'

export default (app: Koa) => {
  fs.readdirSync('./app/routes').forEach((item: string) => {
    if (item === 'index.ts') return
    const router: Router = require(`./${item}`)
    app.use(router.routes()).use(router.allowedMethods())
  })
}
