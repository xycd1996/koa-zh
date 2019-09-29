import { secret } from '../config'
import jwt from 'koa-jwt'
import Router from 'koa-router'
import UsersCtl from '../controllers/users'
const router = new Router({ prefix: '/users' })

const auth = jwt({ secret })

router.get('/', UsersCtl.find)

router.get('/:id', UsersCtl.checkUserExist, UsersCtl.findId)

router.post('/', UsersCtl.create)

router.patch(
  '/:id',
  auth,
  UsersCtl.checkOwn,
  UsersCtl.checkUserExist,
  UsersCtl.update
)

router.delete(
  '/:id',
  auth,
  UsersCtl.checkOwn,
  UsersCtl.checkUserExist,
  UsersCtl.delete
)

router.post('/login', UsersCtl.login)

module.exports = router
