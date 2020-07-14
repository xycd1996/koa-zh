import { UsersModelTypes } from './../types/users'
import { Context } from 'koa'
import UsersTypes from 'users'
import User from '../models/users'
import Question from '../models/questions'
import Answer from '../models/answers'
import jsonwebtoken from 'jsonwebtoken'
import { secret } from '../config'

class UsersCtl implements UsersTypes {
  public async find(ctx: Context) {
    const { per_page = 10 } = ctx.query
    const perPage = Math.max(per_page * 1, 1)
    const page = Math.max(ctx.query.page * 1, 1)
    const user = await User.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip((page - 1) * perPage)
    ctx.body = user
  }

  public async findById(ctx: Context) {
    const { fields = '' }: { fields: string } = ctx.query
    const selected = fields
      .split(';')
      .filter((f) => f)
      .map((item) => ' +' + item)
      .join('')
    const populated = fields
      .split(';')
      .filter((f) => f)
      .map((f) => {
        if (f === 'employments') {
          return 'employments.company employments.job'
        }
        if (f === 'educations') {
          return 'educations.school educations.major'
        }
        return f
      })
      .join(' ')
    const user = await User.findById(ctx.params.id).select(selected).populate(populated)
    ctx.body = user
  }

  public async create(ctx: Context) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const userExist = await User.findOne({ name: ctx.request.body.name })
    if (userExist) ctx.throw(403, '用户已存在')
    const user = await new User(ctx.request.body).save()
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
      educations: { type: 'array', itemType: 'object', required: false },
    })
    const user = await User.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body)
    ctx.body = user
  }

  public async delete(ctx: Context) {
    await User.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }

  /**
   * 验证params用户是否存在
   *
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UsersCtl
   */
  public async checkUserExist(ctx: Context, next: Function) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  /**
   * 校验用户登录
   *
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UsersCtl
   */
  public async checkUserLogin(ctx: Context, next: Function) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const name = await User.findOne({ name: ctx.request.body.name })
    const user = await User.findOne(ctx.request.body)
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
      expiresIn: '1d',
    })
    ctx.body = { token }
    // 成功登陆后续每次请求，ctx.state.user会带入解密后的用户信息 _id, name
  }

  /**
   * 认证用户是否为登录用户
   *
   * @param {Context} ctx
   * @param {Function} next
   * @memberof UsersCtl
   */
  public async checkOwn(ctx: Context, next: Function) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '无权限操作其他用户')
    }
    await next()
  }

  /**
   * 查看用户关注列表
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async listFollowing(ctx: Context) {
    const user: any = await User.findById(ctx.params.id).select('+following').populate('following')
    const following = user.following
    ctx.body = following
  }

  // 关注某人
  public async follow(ctx: Context) {
    const me: any = await User.findById(ctx.state.user._id).select('+following')
    if (me.following.includes(ctx.params.id)) {
      ctx.throw(403, '该用户已关注')
    }
    me.following.push(ctx.params.id)
    me.save()
    ctx.status = 204
  }

  // 取消关注
  public async unFollow(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    const followList: string[] = (me as any).following
    // following子集需要用toString()进行序列化，否则类型为object无法对上
    const index: number = followList.map((f) => f.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      followList.splice(index, 1)
      me!.save()
    }
    ctx.status = 204
  }

  public async listFollower(ctx: Context) {
    const follower = await User.find({ following: ctx.params.id })
    ctx.body = follower
  }

  // 用户关注话题列表
  public async listFollowingTopics(ctx: Context) {
    const user: any = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
    const topics = user.followingTopics
    ctx.body = topics
  }

  public async followTopics(ctx: Context) {
    const me: any = await User.findById(ctx.state.user._id).select('+followingTopics')
    if (me.followingTopics.includes(ctx.params.id)) {
      ctx.throw(403, '该专题已关注')
    }
    me.followingTopics.push(ctx.params.id)
    me.save()
    ctx.status = 204
  }

  public async unFollowTopics(ctx: Context) {
    const me = await User.findById(ctx.state.user._id).select('+followingTopics')
    const followTopicsList: string[] = (me as any).followingTopics
    // following子集需要用toString()进行序列化，否则类型为object无法对上
    const index: number = followTopicsList.map((f) => f.toString()).indexOf(ctx.params.id)
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

  /**
   * 列出喜欢答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async listLikingAnswers(ctx: Context) {
    const user = (await User.findById(ctx.params.id).select('+linkingAnswers').populate('linkingAnswers')) as UsersModelTypes
    const answers = user.linkingAnswers
    ctx.body = answers
  }

  /**
   * 喜欢答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async likingAnswer(ctx: Context) {
    const user = (await User.findById(ctx.state.user._id).select('+linkingAnswers')) as UsersModelTypes
    if (!user.linkingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      user.linkingAnswers.push(ctx.params.id)
      user.save()
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: 1 } })
    } else {
      ctx.throw(403, '已赞过该答案')
    }
    ctx.status = 204
  }

  /**
   * 取消喜欢答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async unLikingAnswer(ctx: Context, next: Function) {
    const user = (await User.findById(ctx.state.user._id).select('+linkingAnswers')) as UsersModelTypes
    const index = user.linkingAnswers.map((id) => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      user.linkingAnswers.splice(index, 1)
      user.save()
      await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { voteCount: -1 } })
    }
    ctx.status = 204
    await next()
  }

  /**
   *  踩答案列表
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async listDislikingAnswers(ctx: Context) {
    const user = (await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers')) as UsersModelTypes
    const answers = user.dislikingAnswers
    ctx.body = answers
  }

  /**
   * 踩答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async dislikingAnswer(ctx: Context) {
    const user = (await User.findById(ctx.state.user._id).select('+dislikingAnswers')) as UsersModelTypes
    if (!user.dislikingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      user.dislikingAnswers.push(ctx.params.id)
      user.save()
    } else {
      ctx.throw(403, '该答案已被踩过')
    }
    ctx.status = 204
  }

  /**
   * 取消踩答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async unDislikingAnswer(ctx: Context, next: Function) {
    const user = (await User.findById(ctx.state.user._id).select('+dislikingAnswers')) as UsersModelTypes
    const index = user.dislikingAnswers.map((id) => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      user.dislikingAnswers.splice(index, 1)
      user.save()
    }
    ctx.status = 204
    await next()
  }

  /**
   * 收藏答案
   *
   * @memberof UsersCtl
   */
  public async collectAnswer(ctx: Context) {
    const user = (await User.findById(ctx.state.user._id).select('+collectingAnswers')) as UsersModelTypes
    if (!user.collectingAnswers.map((id) => id.toString()).includes(ctx.params.id)) {
      user.collectingAnswers.push(ctx.params.id)
      user.save()
    }
    ctx.status = 204
  }

  /**
   * 列出某个用户收藏答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async listCollectingAnswer(ctx: Context) {
    const user = (await User.findById(ctx.params.id).select('+collectingAnswers').populate('collectingAnswers')) as UsersModelTypes
    ctx.body = user.collectingAnswers
  }

  /**
   * 取消收藏答案
   *
   * @param {Context} ctx
   * @memberof UsersCtl
   */
  public async unCollectingAnswer(ctx: Context) {
    const user = (await User.findById(ctx.state.user._id).select('+collectingAnswers')) as UsersModelTypes
    const index = user.collectingAnswers.map((id) => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      user.collectingAnswers.splice(index, 1)
      user.save()
    }
    ctx.status = 204
  }
}

export default new UsersCtl()
