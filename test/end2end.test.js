import test from 'ava'
import request from 'supertest-as-promised'
import mongoose from 'mongoose'

import { UserModel } from './fixture/userModel'
import bootServer from './fixture/testServer'

let app
test.before(async (t) => {
  mongoose.connect('mongodb://localhost/test')
  app = await bootServer()
})

test('should create and query when giving correct params', async t => {
  let userId
  await request(app)
    .post('/graphql')
    .set('content-type', 'application/json')
    .send({
      query: `mutation create {
        user: createUser(
          userName: "wzx"
          hobbies: ["basketball", "travelling"]
        ) {
          id,
          userName
          hobbies
        }
      }`
    })
    .expect(200)
    .then(res => {
      userId = res.body.data.user.id
      t.not(res.body.data.user.id, undefined)
      t.is(res.body.data.user.userName, 'wzx')
      t.deepEqual(res.body.data.user.hobbies, ['basketball', 'travelling'])
    })

  await request(app)
    .get(`/graphql?query={ user(id: "${userId}") { id } }`)
    .expect(200)
    .then(res => {
      t.is(res.body.data.user[0].id, userId)
    })

  await request(app)
    .post('/graphql')
    .set('content-type', 'application/json')
    .send({
      query: `mutation delete {
        deleteUser(
          id: "${userId}"
        ) {
          success,
          msg
        }
      }`
    })
    .expect(200)
    .then(res => {
      t.true(res.body.data.deleteUser.success)
    })
})

test('should able to create custom query or mutation', async t => {
  let userId
  await request(app)
    .post('/graphql')
    .set('content-type', 'application/json')
    .send({
      query: `mutation customCreate {
        user: customAddUser(
          userName: "wzx"
          hobbies: ["basketball", "travelling"]
          age: 10
        ) {
          id,
          userName
          hobbies
          age
        }
      }`
    })
    .expect(200)
    .then(res => {
      userId = res.body.data.user.id
      t.not(res.body.data.user.id, undefined)
      t.is(res.body.data.user.userName, 'wzx')
      t.deepEqual(res.body.data.user.hobbies, ['basketball', 'travelling'])
      t.is(res.body.data.user.age, 10)
    })
  await UserModel.findByIdAndRemove(userId)
})
