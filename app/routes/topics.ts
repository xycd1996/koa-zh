import { secret } from './../config/index'
import Router from 'koa-router'
import TopicCtl from '../controllers/topics'
import jwt from 'koa-jwt'
const router = new Router({ prefix: '/topics' })

const auth = jwt({ secret })

router.get('/', TopicCtl.find)

router.get('/:id', TopicCtl.findById)

router.post('/', auth, TopicCtl.create)

router.patch('/:id', auth, TopicCtl.update)

router.get(
  '/:id/followers',
  TopicCtl.checkTopicsExist,
  TopicCtl.listTopicFollower
)

module.exports = router
