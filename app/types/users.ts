import { Context } from 'koa'
import { Document, Schema } from 'mongoose'

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
  listLikingAnswers(ctx: Context, next?: Function): void
  likingAnswer(ctx: Context, next?: Function): void
  unLikingAnswer(ctx: Context, next?: Function): void
  listDislikingAnswers(ctx: Context, next?: Function): void
  dislikingAnswer(ctx: Context, next?: Function): void
  unDislikingAnswer(ctx: Context, next?: Function): void
  collectAnswer(ctx: Context, next?: Function): void
}

export interface UsersModelTypes extends Document {
  name: string
  password: string
  avatar_url: string
  business: Schema.Types.ObjectId
  employments: Schema.Types.ObjectId[]
  gender: 'man' | 'woman'
  headline: string
  locations: Schema.Types.ObjectId[]
  educations: EducationsTypes[]
  // following为 _id类型，关联 User 模型数据
  following: Schema.Types.ObjectId[]
  followingTopics: Schema.Types.ObjectId[]
  linkingAnswers: Schema.Types.ObjectId[]
  dislikingAnswers: Schema.Types.ObjectId[]
  collectingAnswers: Schema.Types.ObjectId[]
}

interface EducationsTypes {
  school: Schema.Types.ObjectId
  major: Schema.Types.ObjectId
  diploma: 1 | 2 | 3 | 4 | 5
  entrance_year: number
  graduation_year: number
}
