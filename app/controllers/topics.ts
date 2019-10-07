import { Context } from 'koa'
import TopicSchema from '../models/topic'
import TopicTypes from 'topic'

class TopicCtl implements TopicTypes {
  async find(ctx: Context) {
    const topic = await TopicSchema.find()
    ctx.body = topic
  }

  async findById(ctx: Context) {
    const { filed }: { filed: string } = ctx.query
    const TopicSelected = filed
      ? filed
          .split(';')
          .filter(f => f)
          .map(f => ' +' + f)
          .join(';')
      : ''
    const topic = await TopicSchema.findById(ctx.params.id).select(
      TopicSelected
    )
    ctx.body = topic
  }

  async create(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const newTopic = new TopicSchema(ctx.request.body)
    newTopic.save()
    ctx.body = newTopic
  }

  async update(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const newTopic = await TopicSchema.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    )
    ctx.body = newTopic
  }
}

export default new TopicCtl()
