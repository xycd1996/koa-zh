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

// 获取关注列表
router.get('/:id/following', UsersCtl.checkUserExist, UsersCtl.listFollowing)

// 关注某人
router.put('/following/:id', auth, UsersCtl.checkUserExist, UsersCtl.follow)

// 取消关注某人
router.delete(
  '/following/:id',
  auth,
  UsersCtl.checkUserExist,
  UsersCtl.unFollow
)

router.get('/:id/follower', UsersCtl.checkUserExist, UsersCtl.listFollower)

router.post('/login', UsersCtl.login)

// 因为 index.ts 文件中利用 require 引入，因此采用 module.exports 导出
module.exports = router
