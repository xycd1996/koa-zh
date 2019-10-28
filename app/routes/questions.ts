import { secret } from './../config/index'
import Router from 'koa-router'
import Question from '../controllers/questions'
import jwt from 'koa-jwt'

const router = new Router({ prefix: '/questions' })

const auth = jwt({ secret })

router.get('/', Question.find)

router.get('/:id', Question.checkQuestionExist, Question.findById)

router.post('/', auth, Question.create)

router.patch('/:id', auth, Question.checkQuestionExist, Question.update)

router.delete('/:id', auth, Question.checkQuestionExist, Question.delete)

module.exports = router
