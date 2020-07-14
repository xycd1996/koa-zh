import { secret } from './../config/index'
import Router from 'koa-router'
import Answer from '../controllers/answers'
import jwt from 'koa-jwt'

const router = new Router({ prefix: '/questions/:questionId/answers' })

const auth = jwt({ secret })

router.get('/', Answer.find)

router.get('/:id', Answer.checkAnswerExist, Answer.findById)

router.post('/', auth, Answer.create)

router.patch('/:id', auth, Answer.checkAnswerExist, Answer.checkAnswerer, Answer.update)

router.delete('/:id', auth, Answer.checkAnswerExist, Answer.checkAnswerer, Answer.delete)

module.exports = router
