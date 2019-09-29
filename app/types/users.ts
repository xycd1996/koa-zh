import { Context } from 'koa'

export default interface UsersTypes {
  find(ctx: Context, next?: Function): void
  findId(ctx: Context, next?: Function): void
  create(ctx: Context, next?: Function): void
  update(ctx: Context, next?: Function): void
  delete(ctx: Context, next?: Function): void
  checkUserExist(ctx: Context, next?: Function): void
  login(ctx: Context, next?: Function): void
  checkOwn(ctx: Context, next?: Function): void
}
