import { Context } from 'koa'
import UsersTypes from 'users'
import UsersSchema from '../models/users'
import Question from '../models/questions'
import jsonwebtoken from 'jsonwebtoken'
import { secret } from '../config'

class UsersCtl implements UsersTypes {
  public async find(ctx: Context) {
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(per_page * 1, 1)
    const page = Math.max(ctx.query.page * 1, 1)
    const user = await UsersSchema.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip((page - 1) * perPage)
    ctx.body = user
  }

  public async findById(ctx: Context) {
    const { fields = '' }: { fields: string } = ctx.query
    const selected = fields
      .split(';')
      .filter(f => f)
      .map(item => ' +' + item)
      .join('')
    const populated = fields
      .split(';')
      .filter(f => f)
      .map(f => {
        if (f === 'employments') {
          return 'employments.company employments.job'
        }
        if (f === 'educations') {
          return 'educations.school educations.major'
        }
        return f
      })
      .join(' ')
    console.log(populated)
    const user = await UsersSchema.findById(ctx.params.id)
      .select(selected)
      .populate(populated)
    ctx.body = user
  }

  public async create(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const userExist = await UsersSchema.findOne({ name: ctx.request.body.name })
    if (userExist) ctx.throw(403, '用户已存在')
    const user = await new UsersSchema(ctx.request.body).save()
    ctx.body = user
  }

  public async update(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      business: { type: 'string', required: false },
      gender: { type: 'enum', values: ['man', 'woman'], required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    const user = await UsersSchema.findByIdAndUpdate(
      { _id: ctx.params.id },
      ctx.request.body
    )
    ctx.body = user
  }

  public async delete(ctx: Context) {
    await UsersSchema.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }

  public async checkUserExist(ctx: Context, next: Function) {
    const user = await UsersSchema.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  public async checkUserLogin(ctx: Context, next: Function) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const name = await UsersSchema.findOne({ name: ctx.request.body.name })
    const user = await UsersSchema.findOne(ctx.request.body)
    if (!name) {
      ctx.throw(404, '用户不存在')
    }
    if (!user) {
      ctx.throw(403, '密码错误')
    }
    ctx.state.user = user
    await next()
  }

  public async login(ctx: Context) {
    const { _id, name } = ctx.state.user
    const token = jsonwebtoken.sign({ _id, name }, secret, {
      expiresIn: '1d'
    })
    ctx.body = { token }
    // 成功登陆后续每次请求，ctx.state.user会带入解密后的用户信息 _id, name
  }

  // 认证用户是否为登录用户
  public async checkOwn(ctx: Context, next: Function) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '无权限操作其他用户')
    }
    await next()
  }

  // 查看用户关注列表
  public async listFollowing(ctx: Context) {
    const user: any = await UsersSchema.findById(ctx.params.id)
      .select('+following')
      .populate('following')
    const following = user.following
    ctx.body = following
  }

  // 关注某人
  public async follow(ctx: Context) {
    const me: any = await UsersSchema.findById(ctx.state.user._id).select(
      '+following'
    )
    if (me.following.includes(ctx.params.id)) {
      ctx.throw(403, '该用户已关注')
    }
    me.following.push(ctx.params.id)
    me.save()
    ctx.status = 204
  }

  // 取消关注
  public async unFollow(ctx: Context) {
    const me = await UsersSchema.findById(ctx.state.user._id).select(
      '+following'
    )
    const followList: string[] = (me as any).following
    // following子集需要用toString()进行序列化，否则类型为object无法对上
    const index: number = followList
      .map(f => f.toString())
      .indexOf(ctx.params.id)
    if (index > -1) {
      followList.splice(index, 1)
      me!.save()
    }
    ctx.status = 204
  }

  public async listFollower(ctx: Context) {
    const follower = await UsersSchema.find({ following: ctx.params.id })
    ctx.body = follower
  }

  // 用户关注话题列表
  public async listFollowingTopics(ctx: Context) {
    const user: any = await UsersSchema.findById(ctx.params.id)
      .select('+followingTopics')
      .populate('followingTopics')
    const topics = user.followingTopics
    ctx.body = topics
  }

  public async followTopics(ctx: Context) {
    const me: any = await UsersSchema.findById(ctx.state.user._id).select(
      '+followingTopics'
    )
    if (me.followingTopics.includes(ctx.params.id)) {
      ctx.throw(403, '该专题已关注')
    }
    me.followingTopics.push(ctx.params.id)
    me.save()
    ctx.status = 204
  }

  public async unFollowTopics(ctx: Context) {
    const me = await UsersSchema.findById(ctx.state.user._id).select(
      '+followingTopics'
    )
    const followTopicsList: string[] = (me as any).followingTopics
    // following子集需要用toString()进行序列化，否则类型为object无法对上
    const index: number = followTopicsList
      .map(f => f.toString())
      .indexOf(ctx.params.id)
    if (index > -1) {
      followTopicsList.splice(index, 1)
      me!.save()
    }
    ctx.status = 204
  }

  public async listQuestions(ctx: Context) {
    const questions = await Question.find({ questioner: ctx.params.id })
    ctx.body = questions
  }
}

export default new UsersCtl()
