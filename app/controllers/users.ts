import { Context } from 'koa'
import UsersTypes from 'users'
import UsersSchema from '../models/users'
import jsonwebtoken from 'jsonwebtoken'
import { secret } from '../config'

class UsersCtl implements UsersTypes {
  public async find(ctx: Context) {
    const user = await UsersSchema.find()
    ctx.body = user
  }

  public async findId(ctx: Context) {
    const user = await UsersSchema.findById(ctx.params.id)
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
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
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

  public async login(ctx: Context) {
    const user: any = await UsersSchema.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名或密码错误')
    }
    const { _id, name } = user
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
}

export default new UsersCtl()
