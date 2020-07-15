import HomeTypes from 'home'
import { Context } from 'koa'
import path from 'path'

class HomeCtl implements HomeTypes {
  public async upload(ctx: Context) {
    if (!ctx.request.files) {
      ctx.throw(412, '文件上传不能为空')
    }
    console.log(ctx.origin)
    const filePath: string = `${ctx.origin}/uploads/${path.basename(ctx.request.files!.file.path)}`
    ctx.body = { filePath }
  }
}

export default new HomeCtl()
