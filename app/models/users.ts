import { Schema, model } from 'mongoose'

const UsersSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  business: { type: String },
  employments: { type: [{ company: String, job: String }], select: false },
  gender: {
    type: String,
    enum: ['man', 'woman'],
    default: 'man',
    required: true
  },
  headline: { type: String, select: false },
  locations: { type: [String], select: false },
  educations: {
    type: [
      {
        school: String,
        major: String,
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: Number,
        graduation_year: Number
      }
    ],
    select: false
  },
  // following为 _id类型，关联 User 模型数据
  following: {
    type: [{ type: Schema.Types.ObjectId, refs: 'User' }],
    select: false
  }
})

export default model('User', UsersSchema)
