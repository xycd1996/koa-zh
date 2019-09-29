import Koa from 'koa'

declare function koaParameter(app: Koa, translate?: any): Koa.Middleware

export = koaParameter
