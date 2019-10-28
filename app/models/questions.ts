import { model, Schema } from 'mongoose'

const QuestionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String, select: false },
  questioner: { type: Schema.Types.ObjectId, ref: 'User', select: false }
})

export default model('Question', QuestionSchema)
