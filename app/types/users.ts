import { Context } from 'koa'

export default interface UsersTypes {
  find(ctx: Context, next?: Function): void
  findById(ctx: Context, next?: Function): void
  create(ctx: Context, next?: Function): void
  update(ctx: Context, next?: Function): void
  delete(ctx: Context, next?: Function): void
  checkUserExist(ctx: Context, next?: Function): void
  checkUserLogin(ctx: Context, next?: Function): void
  login(ctx: Context, next?: Function): void
  checkOwn(ctx: Context, next?: Function): void
  listFollowing(ctx: Context, next?: Function): void
  follow(ctx: Context, next?: Function): void
  unFollow(ctx: Context, next?: Function): void
  listFollower(ctx: Context, next?: Function): void
  listFollowingTopics(ctx: Context, next?: Function): void
  followTopics(ctx: Context, next?: Function): void
  unFollowTopics(ctx: Context, next?: Function): void
  listQuestions(ctx: Context, next?: Function): void
}
