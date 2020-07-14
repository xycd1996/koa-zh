import { Context } from 'koa'
import { Schema, Document } from 'mongoose'

interface AnswerTypes {
  find(ctx: Context, next?: Function): void
  findById(ctx: Context, next?: Function): void
  create(ctx: Context, next?: Function): void
  update(ctx: Context, next?: Function): void
  delete(ctx: Context, next?: Function): void
  checkAnswerExist(ctx: Context, next?: Function): void
  checkAnswerer(ctx: Context, next?: Function): void
}

export interface AnswerModelType extends Document {
  content: String
  answerer: Schema.Types.ObjectId
  questionId: String
}

export default AnswerTypes
