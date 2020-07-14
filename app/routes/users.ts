import { secret } from '../config'
import jwt from 'koa-jwt'
import Router from 'koa-router'
import UsersCtl from '../controllers/users'
import TopicCtl from '../controllers/topics'
import AnswerCtl from '../controllers/answers'
const router = new Router({ prefix: '/users' })

const auth = jwt({ secret })

// 查询用户列表
router.get('/', UsersCtl.find)

// 查询某个用户
router.get('/:id', UsersCtl.checkUserExist, UsersCtl.findById)

// 创建用户
router.post('/', UsersCtl.create)

// 更新用户信息
router.patch('/:id', auth, UsersCtl.checkOwn, UsersCtl.checkUserExist, UsersCtl.update)

// 删除用户
router.delete('/:id', auth, UsersCtl.checkOwn, UsersCtl.checkUserExist, UsersCtl.delete)

// 获取关注列表
router.get('/:id/following', UsersCtl.checkUserExist, UsersCtl.listFollowing)

// 关注某人
router.put('/following/:id', auth, UsersCtl.checkUserExist, UsersCtl.follow)

// 取消关注某人
router.delete('/following/:id', auth, UsersCtl.checkUserExist, UsersCtl.unFollow)

// 用户粉丝
router.get('/:id/followers', UsersCtl.checkUserExist, UsersCtl.listFollower)

// 用户登录
router.post('/login', UsersCtl.checkUserLogin, UsersCtl.login)

// 关注某个专题
router.put('/followingTopics/:id', auth, TopicCtl.checkTopicsExist, UsersCtl.followTopics)

// 取消关注某个专题
router.delete('/followingTopics/:id', auth, TopicCtl.checkTopicsExist, UsersCtl.unFollowTopics)

// 获取某用户专题关注列表
router.get('/:id/followingTopics', UsersCtl.checkUserExist, UsersCtl.listFollowingTopics)

// 获取用户的问题列表
router.get('/:id/questions', UsersCtl.checkUserExist, UsersCtl.listQuestions)

// 获取用户的喜欢答案列表
router.get('/:id/likingAnswers', UsersCtl.checkUserExist, UsersCtl.listLikingAnswers)

// 获取用户的踩答案列表
router.get('/:id/dislikingAnswers', UsersCtl.checkUserExist, UsersCtl.listDislikingAnswers)

// 喜欢答案
router.put('/likingAnswers/:id', auth, AnswerCtl.checkAnswerExist, UsersCtl.unDislikingAnswer, UsersCtl.likingAnswer)

// 取消喜欢答案
router.delete('/likingAnswers/:id', auth, AnswerCtl.checkAnswerExist, UsersCtl.unLikingAnswer)

// 踩答案
router.put('/dislikingAnswers/:id', auth, AnswerCtl.checkAnswerExist, UsersCtl.unLikingAnswer, UsersCtl.dislikingAnswer)

// 取消踩答案
router.delete('/dislikingAnswers/:id', auth, AnswerCtl.checkAnswerExist, UsersCtl.unDislikingAnswer)

// 获取用户收藏答案列表
router.get('/:id/collectingAnswers', UsersCtl.checkUserExist, UsersCtl.listCollectingAnswer)

// 收藏答案
router.put('/collectingAnswers/:id', auth, AnswerCtl.checkAnswerExist, UsersCtl.collectAnswer)

// 取消收藏答案
router.delete('/collectingAnswers/:id', auth, AnswerCtl.checkAnswerExist, UsersCtl.unCollectingAnswer)

// 因为 index.ts 文件中利用 require 引入，因此采用 module.exports 导出
module.exports = router
