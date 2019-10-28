import { Context } from 'koa'

interface QuestionTypes {
  find(ctx: Context, next?: Function): void
  findById(ctx: Context, next?: Function): void
  create(ctx: Context, next?: Function): void
  update(ctx: Context, next?: Function): void
  delete(ctx: Context, next?: Function): void
  checkQuestionExist(ctx: Context, next?: Function): void
}

export default QuestionTypes
