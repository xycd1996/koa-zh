import { Context } from 'koa'
import TopicSchema from '../models/topics'
import UsersSchema from '../models/users'
import Questions from '../models/questions'
import TopicTypes from 'topic'

class TopicCtl implements TopicTypes {
  public async find(ctx: Context) {
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(per_page * 1, 1)
    const page = Math.max(ctx.query.page * 1, 1)
    const topic = await TopicSchema.find()
      .limit(perPage)
      .skip((page - 1) * perPage)
    ctx.body = topic
  }

  public async findById(ctx: Context) {
    const { fields = '' }: { fields: string } = ctx.query
    const TopicSelected = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ' +' + f)
      .join(';')
    const topic = await TopicSchema.findById(ctx.params.id).select(TopicSelected)
    ctx.body = topic
  }

  public async create(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const newTopic = new TopicSchema(ctx.request.body)
    newTopic.save()
    ctx.body = newTopic
  }

  public async update(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false },
    })
    const newTopic = await TopicSchema.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = newTopic
  }

  public async checkTopicsExist(ctx: Context, next: Function) {
    const topic = await TopicSchema.findById(ctx.params.id)
    if (!topic) {
      ctx.throw(404, '专题不存在')
    }
    await next()
  }

  // 获取话题关注者
  public async listTopicFollower(ctx: Context) {
    const user = await UsersSchema.find({ followingTopics: ctx.params.id })
    ctx.body = user
  }

  /**
   * listQuestions
   */
  public async listQuestions(ctx: Context) {
    const questions = await Questions.find({ topics: ctx.params.id })
    ctx.body = questions
  }
}

export default new TopicCtl()
