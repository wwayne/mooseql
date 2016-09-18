import test from 'ava'
import { GraphQLList } from 'graphql/type'
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'
import mongoose from 'mongoose'

import { UserModel, userType } from './fixture/userModel'
import { SchoolModel, schoolType } from './fixture/schoolModel'
import { modelsToTypes } from '../src/type'

let typeMap
let school
let user
test.before(async t => {
  mongoose.connect('mongodb://localhost/test')

  typeMap = modelsToTypes([UserModel, SchoolModel])
  school = new SchoolModel({
    name: 'universary',
    principal: 'wayne',
    position: 'sh',
    students: 100
  })
  await school.save()
  user = new UserModel({
    name: {
      first: 'wang',
      last: {
        fst: 'zi',
        snd: 21
      }
    },
    userName: 'wayne',
    age: 26,
    isBot: false,
    birthe: new Date(1990, 7, 21),
    binary: new Buffer('wzx'),
    info: { any: { thing: 'foo' } },
    hobbies: ['basketball', 'traviling'],
    currentSchool: school.id,
    education: [school.id]
  })
  await SchoolModel.findByIdAndUpdate(school.id, { principal: user.id })
})

test.after(async t => {
  await SchoolModel.findByIdAndRemove(school.id)
})

test('Mongoose model should be converted to graphql type correctly', t => {
  const convertedUserFields = typeMap['User']._typeConfig.fields()
  const userFields = userType._typeConfig.fields()

  t.is(Object.keys(typeMap).length, 2)
  t.is(typeMap['User'].name, userType.name)
  t.deepEqual(convertedUserFields.id, userFields.id)
  t.deepEqual(convertedUserFields.userName, userFields.userName)
  t.deepEqual(convertedUserFields.name.type._typeConfig.fields().first, userFields.name.type._typeConfig.fields().first)
  t.deepEqual(convertedUserFields.age, userFields.age)
  t.deepEqual(convertedUserFields.isBot, userFields.isBot)
  t.deepEqual(convertedUserFields.birth, userFields.birth)
  t.deepEqual(convertedUserFields.binary, userFields.binary)
  t.deepEqual(convertedUserFields.info, userFields.info)
  t.deepEqual(convertedUserFields.hobbies, userFields.hobbies)
  t.deepEqual(convertedUserFields.currentSchool.type.name, userFields.currentSchool.type.name)
  t.true(convertedUserFields.education.type instanceof GraphQLList)
  t.deepEqual(convertedUserFields.education.type.ofType.name, userFields.education.type.ofType.name)
})

test('Special params should be converted from model to type', t => {
  const convertedSchoolFields = typeMap['School']._typeConfig.fields()
  const schoolFields = schoolType._typeConfig.fields()
  t.is(convertedSchoolFields.principal.required, schoolFields.principal.required)
  t.is(convertedSchoolFields.principal.context, schoolFields.principal.context)
})

test('Mongoose model should be accessable to query after converting', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        user: {
          type: typeMap['User'],
          resolve: () => user
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{
    user {
      id,
      name {
        first,
        last {
          fst,
          snd
        }
      }
      userName,
      age,
      isBot,
      birth,
      binary,
      info,
      hobbies,
      currentSchool {
        id,
        name
      },
      education {
        id
      }
    }
  }`)
  const userRes = queryRes.data.user
  t.is(userRes.id, user.id)
  t.is(userRes.userName, user.userName)
  t.is(userRes.name.first, user.name.first)
  t.is(userRes.name.last.fst, user.name.last.fst)
  t.is(userRes.name.last.snd, user.name.last.snd)
  t.is(userRes.age, user.age)
  t.is(userRes.isBot, user.isBot)
  t.is(userRes.birth, user.birth)
  t.is(userRes.binary, user.binary)
  t.deepEqual(userRes.info, user.info)
  t.deepEqual(userRes.hobbies, ['basketball', 'traviling']) // Object.keys diff
  t.is(userRes.currentSchool.id, school.id)
  t.is(userRes.currentSchool.name, school.name)
  t.is(userRes.education[0].id, school.id)
})
