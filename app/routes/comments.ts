import { secret } from './../config/index'
import Router from 'koa-router'
import Comment from '../controllers/comments'
import jwt from 'koa-jwt'

const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' })

const auth = jwt({ secret })

router.get('/', Comment.find)

router.get('/:id', Comment.checkCommentExist, Comment.findById)

router.post('/', auth, Comment.create)

router.patch('/:id', auth, Comment.checkCommentExist, Comment.update)

router.delete('/:id', auth, Comment.checkCommentExist, Comment.delete)

module.exports = router
