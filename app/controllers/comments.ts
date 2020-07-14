import { CommentsTypes } from './../types/comments'
import Comment from '../models/comments'
import Question from '../models/questions'
import Answer from '../models/answers'
import { Context } from 'koa'

class CommentsCtl {
  /**
   * 获取某个问题下答案的评论列表
   *
   * @param {Context} ctx
   * @memberof CommentsCtl
   */

  public async find(ctx: Context) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1)
    const q = new RegExp(ctx.query.q)
    const { rootCommentId } = ctx.query
    const comments = await Comment.find({ content: q, questionId: ctx.params.questionId, answerId: ctx.params.answerId, rootCommentId })
      .limit(per_page * 1)
      .skip((page - 1) * per_page)
      .populate('commentator replyTo')
    ctx.body = comments
  }

  public async findById(ctx: Context) {
    const { fields = '' }: { fields: string } = ctx.query
    const selected = fields
      .split(';')
      .filter((f) => f)
      .map((f) => '+' + f)
      .join(' ')
    const comment = await Comment.findById(ctx.params.id).select(selected).populate('commentator')
    ctx.body = comment
  }

  /**
   * 新建评论
   *
   * @param {Context} ctx
   * @memberof CommentsCtl
   */
  public async create(ctx: Context) {
    const question = await Question.findById(ctx.params.questionId)
    const answer = await Answer.findById(ctx.params.answerId)
    if (!question || !answer) {
      ctx.throw(403, '该问题或答案不存在')
    }
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false },
    })
    const comment = await new Comment({
      ...ctx.request.body,
      questionId: ctx.params.questionId,
      answerId: ctx.params.answerId,
      commentator: ctx.state.user._id,
    }).save()
    ctx.body = comment
  }

  /**
   * 删除评论
   *
   * @param {Context} ctx
   * @memberof CommentsCtl
   */
  public async delete(ctx: Context) {
    await ctx.state.comment.remove()
    ctx.status = 204
  }

  /**
   * 校验评论是否存在
   *
   * @param {Context} ctx
   * @param {Function} next
   * @memberof CommentsCtl
   */
  public async checkCommentExist(ctx: Context, next: Function) {
    const comment = (await Comment.findById(ctx.params.id)) as CommentsTypes
    if (!comment) {
      ctx.throw(403, '评论不存在')
    }
    if (ctx.params.answerId !== comment.answerId || ctx.params.questionId !== comment.questionId) {
      ctx.throw(403, '该答案或问题下不存在该评论')
    }
    ctx.state.comment = comment
    await next()
  }

  /**
   * 更新评论
   *
   * @param {Context} ctx
   * @memberof CommentsCtl
   */
  public async update(ctx: Context) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const { content } = ctx.request.body
    const comment: CommentsTypes = ctx.state.comment
    await comment.update({ content })
    ctx.body = comment
  }
}

export default new CommentsCtl()
