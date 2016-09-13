import test from 'ava'
import koa from 'koa'

test.before(t => {
  const app = koa()
  app.listen(3000)
})

test.only('should create and query when giving correct params', () => {})
