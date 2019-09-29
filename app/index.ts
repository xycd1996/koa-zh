import Koa from 'koa'
import routing from './routes'
import Mongoose, { Error } from 'mongoose'
import { connectionStr } from './config'
import koaBody from 'koa-body'
import error from 'koa-json-error'
import koaParameter from 'koa-parameter'

const app = new Koa()

Mongoose.connect(
  connectionStr,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log('Mongoose 连接成功')
  }
)

Mongoose.connection.on('error', console.error)

function formatError(err: Error): Error {
  const { stack, ...other } = err
  console.log(other)
  if (process.env.NODE_ENV === 'production') {
    return other
  }
  return err
}

app.use(koaParameter(app))
app.use(
  error({
    preFormat: formatError
  })
)
app.use(koaBody())
routing(app)

app.listen(3000, () => {
  console.log('3000 端口已启动')
})
