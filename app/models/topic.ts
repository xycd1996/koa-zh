import mongoose from 'mongoose'

const { model, Schema } = mongoose

const TopicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  avatar_url: { type: String },
  introduction: { type: String, select: false }
})

export default model('Topic', TopicSchema)

// 名称
// 话题头像
// introduction  话题简介文字较长
//
