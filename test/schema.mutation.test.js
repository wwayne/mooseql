import test from 'ava'
import mongoose from 'mongoose'
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'

import { UserModel } from './fixture/userModel'
import { SchoolModel } from './fixture/schoolModel'
import { modelsToTypes } from '../src/type'
import buildMutation from '../src/schema/buildMutation'

let school
let school2
let user
let userSchema
test.before(async t => {
  mongoose.connect('mongodb://localhost/test')

  const typeMap = modelsToTypes([UserModel, SchoolModel])
  const userMutationField = buildMutation(UserModel, typeMap['User'])
  userSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: { user: { type: typeMap['User'] } }
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: userMutationField
    })
  })
  school = new SchoolModel({
    name: 'universary',
    position: 'sh',
    students: 100
  })
  school2 = new SchoolModel({
    name: 'highschool',
    position: 'zh',
    students: 10
  })
  user = new UserModel({
    userName: 'wayne',
    name: { first: 'wang' },
    age: 26,
    isBot: false,
    birth: new Date(1990, 7, 21),
    binary: new Buffer('wzx'),
    info: { any: { thing: 'foo' } },
    hobbies: ['basketball', 'travelling'],
    currentSchool: school.id,
    education: [school.id]
  })
  await user.save()
  await school.save()
  await school2.save()
})

test.after(async t => {
  await UserModel.findByIdAndRemove(user.id)
  await SchoolModel.find({ _id: {$in: [school.id, school2.id]} }).remove()
})

test('should create with any mongoose path when giving valid type', async t => {
  const queryRes = await graphql(
    userSchema,
    `mutation addUser {
      user: createUser(
        userName: "wzx",
        name_first: "wang",
        age: 26,
        isBot: false,
        birth: "${new Date(1990, 7, 21)}",
        binary: "${new Buffer('wzx')}",
        hobbies:["coding"],
        currentSchool: "${school.id}",
        education: ["${school.id}"]
      ) {
        id,
        userName,
        name {
          first
        },
        age,
        isBot,
        birth,
        binary
        hobbies,
        currentSchool {
          id,
          name
        },
        education {
          id
        }
      }
    }`
  )
  const userData = queryRes.data.user
  t.is(userData.userName, 'wzx')
  t.is(userData.name.first, 'wang')
  t.is(userData.age, 26)
  t.false(userData.isBot)
  t.deepEqual(userData.birth, new Date(1990, 7, 21))
  t.deepEqual(userData.binary, new Buffer('wzx'))
  t.deepEqual(userData.hobbies, ['coding'])
  t.is(userData.currentSchool.id, school.id)
  t.is(userData.currentSchool.name, school.name)
  t.is(userData.education[0].id, school.id)
  await UserModel.findByIdAndRemove(userData.id)
})

test('should update a single document attribute when giving valid id', async t => {
  const queryRes = await graphql(
    userSchema,
    `mutation update {
      user: updateUser (
        id: "${user.id}",
        userName: "wwayne",
        name_first: "firstModified",
        hobbies: ["no", "no1"],
        currentSchool: "${school2.id}"
      ) {
        id,
        userName,
        name {
          first
        },
        age,
        isBot,
        birth,
        binary
        hobbies,
        currentSchool {
          id,
          name
        },
        education {
          id
        }
      }
    }`
  )
  const userData = queryRes.data.user
  t.is(userData.userName, 'wwayne')
  t.is(userData.name.first, 'firstModified')
  t.deepEqual(userData.hobbies, ['no', 'no1'])
  t.is(userData.currentSchool.id, school2.id)
  t.is(userData.currentSchool.name, school2.name)
})

test('should delete a document when giving valid id', async t => {
  const user = new UserModel({
    userName: 'wayne',
    hobbies: ['basketball', 'travelling']
  })
  const queryRes = await graphql(
    userSchema,
    `mutation update {
      deleteUser (
        id: "${user.id}"
      ) {
        success,
        msg
      }
    }`
  )
  t.true(queryRes.data.deleteUser.success)
  t.is(queryRes.data.deleteUser.msg, null)
})

test('should response with success false when giving invalid id', async t => {
  const queryRes = await graphql(
    userSchema,
    `mutation delete {
      deleteUser (
        id: "57d79c1150e3ffd8adee7fxz"
      ) {
        success,
        msg
      }
    }`
  )
  t.false(queryRes.data.deleteUser.success)
  t.not(queryRes.data.deleteUser.msg, null)
})

