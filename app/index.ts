import Koa from 'koa'
import routing from './routes'
import Mongoose, { Error } from 'mongoose'
import { connectionStr } from './config'
import koaBody from 'koa-body'
import error from 'koa-json-error'
import koaParameter from 'koa-parameter'
import path from 'path'
import koaStatic from 'koa-static'

const app = new Koa()

Mongoose.connect(
  connectionStr,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => {
    console.log('Mongoose 连接成功')
  }
)

Mongoose.connection.on('error', console.error)

function formatError(err: Error): Error {
  const { stack, ...other } = err
  if (process.env.NODE_ENV === 'production') {
    return other
  }
  return err
}

// 搭建静态资源服务器
app.use(koaStatic(path.join(__dirname, '/public')))
app.use(koaParameter(app))
app.use(
  error({
    preFormat: formatError,
  })
)
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
    },
  })
)
routing(app)

app.listen(3000, () => {
  console.log('3000 端口已启动')
})
