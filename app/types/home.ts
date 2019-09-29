import { Context } from 'koa'

export default interface HomeTypes {
  upload(ctx: Context, next: Function): void
}
