import { model, Schema } from 'mongoose'

const CommentsSchema = new Schema(
  {
    __v: { type: Number, select: false },
    content: { type: String, required: true },
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: String, required: true },
    answerId: { type: String, required: true },
    rootCommentId: { type: String },
    replyTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

export default model('Comment', CommentsSchema)
