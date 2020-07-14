import { secret } from './../config/index'
import Router from 'koa-router'
import Question from '../controllers/questions'
import Comment from '../controllers/comments'
import Answer from '../controllers/answers'
import jwt from 'koa-jwt'

const router = new Router({ prefix: '/questions' })

const auth = jwt({ secret })

router.get('/', Question.find)

router.get('/:id', Question.checkQuestionExist, Question.findById)

router.post('/', auth, Question.create)

router.patch('/:id', auth, Question.checkQuestionExist, Question.update)

router.delete('/:id', auth, Question.checkQuestionExist, Question.delete)

router.get('/:questionId/answers/:answerId/comments', Question.checkQuestionExist, Answer.checkAnswerExist, Comment.find)

router.post('/:questionId/answers/:answerId/comments/:id')

module.exports = router
