import { Context } from 'koa'

export default interface TopicTypes {
  find(ctx: Context, next?: Function): void
  findById(ctx: Context, next?: Function): void
  create(ctx: Context, next?: Function): void
  update(ctx: Context, next?: Function): void
  checkTopicsExist(ctx: Context, next?: Function): void
  listTopicFollower(ctx: Context, next?: Function): void
}
