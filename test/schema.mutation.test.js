import test from 'ava'
import mongoose from 'mongoose'
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'

import { UserModel } from './fixture/userModel'
import { SchoolModel } from './fixture/schoolModel'
import { modelsToTypes } from '../src/type'
import buildMutation from '../src/schema/buildMutation'

let school
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
  // user = new UserModel({
  //   userName: 'wayne',
  //   name: { first: 'wang' },
  //   age: 26,
  //   isBot: false,
  //   birth: new Date(1990, 7, 21),
  //   binary: new Buffer('wzx'),
  //   info: { any: { thing: 'foo' } },
  //   hobbies: ['basketball', 'travelling'],
  //   currentSchool: school.id,
  //   education: [school.id]
  // })
  // await user.save()
  await school.save()
  t.pass()
})

test.after(async t => {
  // await UserModel.findByIdAndRemove(user.id)
  await SchoolModel.findByIdAndRemove(school.id)
  t.pass()
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
  const user = queryRes.data.user
  t.is(user.userName, 'wzx')
  t.is(user.name.first, 'wang')
  t.is(user.age, 26)
  t.false(user.isBot)
  t.deepEqual(user.birth, new Date(1990, 7, 21))
  t.deepEqual(user.binary, new Buffer('wzx'))
  t.deepEqual(user.hobbies, ['coding'])
  t.is(user.currentSchool.id, school.id)
  t.is(user.currentSchool.name, school.name)
  t.is(user.education[0].id, school.id)
  UserModel.findByIdAndRemove(user.id)
})