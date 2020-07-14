import { Document, Schema } from 'mongoose'

export interface CommentsTypes extends Document {
  content: string
  commentator: Schema.Types.ObjectId
  questionId: string
  answerId: string
}
