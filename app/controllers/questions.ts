import Question from '../models/questions'
import QuestionTypes from 'question'
import { Context } from 'koa'

class QuestionsCtl implements QuestionTypes {
  public async find(ctx: Context) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1)
    const q = new RegExp(ctx.query.q)
    const questions = await Question.find({ title: q })
      .limit(per_page * 1)
      .skip((page - 1) * per_page)
    ctx.body = questions
  }

  public async findById(ctx: Context) {
    const { fields = '' } = ctx.query
    const selected = (fields as string)
      .split(';')
      .filter((f) => f)
      .map((f) => '+' + f)
      .join(' ')
    const populate = (fields as string)
      .split(';')
      .filter((f) => {
        if (f === 'description') {
          return
        }
        return f
      })
      .join(' ')
    const question = await Question.findById(ctx.params.id).select(selected).populate(populate)
    ctx.body = question
  }

  public async create(ctx: Context) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
    })
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id,
    }).save()
    ctx.body = question
  }

  public async update(ctx: Context) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
    })
    await ctx.state.question.update(ctx.request.body)
    ctx.body = ctx.state.question
  }

  public async delete(ctx: Context) {
    await ctx.state.question.delete()
    ctx.status = 204
  }

  public async checkQuestionExist(ctx: Context, next: Function) {
    const question = await Question.findById(ctx.params.id).select('+description +questioner')
    if (!question) {
      ctx.throw(404, '该问题不存在')
    }
    if (ctx.state.user && ctx.state.user._id !== (question as any).questioner.toString()) {
      ctx.throw(403, '无权限操作')
    }
    ctx.state.question = question
    await next()
  }
}

export default new QuestionsCtl()
