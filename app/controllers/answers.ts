import { Context } from 'koa'
import Answer from '../models/answers'
import AnswerTypes, { AnswerModelType } from 'answers'

class AnswersCtl implements AnswerTypes {
  /**
   * 查询某问题下面的回答列表
   *
   * @param {Number} per_page
   * @param {String} q
   * @param {Number} page
   * @memberof AnswersCtl
   */
  async find(ctx: Context) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1)
    const q = new RegExp(ctx.query.q)
    const answers = await Answer.find({ content: q, questionId: ctx.params.questionId })
      .limit(per_page * 1)
      .skip((page - 1) * per_page)
    ctx.body = answers
  }

  /**
   * 查找单个回答
   * fields 为链接传入附加参数用于查询对应字段
   * select 用于控制model定义select 为 false 默认不显示字段显示
   * populate 用于关联其他表信息展示（默认为展示id）
   *
   * @param {String} fields
   * @memberof AnswersCtl
   */
  async findById(ctx: Context) {
    const { fields = '' }: { fields: string } = ctx.query
    const selected = fields
      .split(';')
      .filter((f) => f)
      .map((f) => '+' + f)
      .join(' ')
    const answer = await Answer.findById(ctx.params.id).select(selected).populate('answerer')
    ctx.body = answer
  }

  /**
   * 创建回答
   *
   * @param {String} content
   * @memberof AnswersCtl
   */
  async create(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const answer = await new Answer({
      content: ctx.request.body.content,
      answerer: ctx.state.user._id,
      questionId: ctx.params.questionId,
    }).save()
    ctx.body = answer
  }

  /**
   * 更新回答
   *
   * @param {String} content
   * @memberof AnswersCtl
   */
  async update(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    })
    const answer: AnswerModelType = ctx.state.answer
    await answer.update(ctx.request.body)
    ctx.body = answer
  }

  async delete(ctx: Context) {
    const answer: AnswerModelType = ctx.state.answer
    await answer.remove()
    ctx.status = 204
  }

  /**
   * 验证回答是否存在
   *
   * @memberof AnswersCtl
   */
  async checkAnswerExist(ctx: Context, next: Function) {
    const answer = (await Answer.findById(ctx.params.id).select('+answerer')) as AnswerModelType
    if (!answer) {
      ctx.throw(404, '问题不存在')
    }
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下不存在此答案')
    }
    ctx.state.answer = answer
    await next()
  }

  /**
   * 验证登录用户是否为回答者
   * 权限校验
   *
   * @memberof AnswersCtl
   */
  async checkAnswerer(ctx: Context, next: Function) {
    const answer: AnswerModelType = ctx.state.answer
    const loginUserId = ctx.state.user._id
    if (answer.answerer.toString() !== loginUserId) {
      ctx.throw(403, '无权限操作')
    }
    await next()
  }
}

export default new AnswersCtl()
