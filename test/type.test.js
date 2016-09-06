import test from 'ava'
import { GraphQLList } from 'graphql/type'
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'
import mongoose from 'mongoose'

import { UserModel, userType } from './fixture/userModel'
import { SchoolModel } from './fixture/schoolModel'
import { modelsToTypes } from '../src/type'

let typeMap
let school
let user
test.before(async t => {
  mongoose.connect('mongodb://localhost/test')

  typeMap = modelsToTypes([UserModel, SchoolModel])
  school = new SchoolModel({
    name: 'universary',
    position: 'sh',
    students: 100
  })
  user = new UserModel({
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
  await school.save()
  t.pass()
})

test.after(async t => {
  // Drop db use mongoose
  // @see http://stackoverflow.com/questions/10081452/drop-database-with-mongoose
  await SchoolModel.remove({})
  t.pass()
})

test('Mongoose model should be converted to graphql type correctly', t => {
  const convertedUserFileds = typeMap['User']._typeConfig.fields()
  const userFileds = userType._typeConfig.fields()

  t.is(Object.keys(typeMap).length, 2)
  t.is(typeMap['User'].name, userType.name)
  t.deepEqual(convertedUserFileds.id, userFileds.id)
  t.deepEqual(convertedUserFileds.userName, userFileds.userName)
  t.deepEqual(convertedUserFileds.age, userFileds.age)
  t.deepEqual(convertedUserFileds.isBot, userFileds.isBot)
  t.deepEqual(convertedUserFileds.birth, userFileds.birth)
  t.deepEqual(convertedUserFileds.binary, userFileds.binary)
  t.deepEqual(convertedUserFileds.info, userFileds.info)
  t.deepEqual(convertedUserFileds.hobbies, userFileds.hobbies)
  t.deepEqual(convertedUserFileds.currentSchool.type.name, userFileds.currentSchool.type.name)
  t.true(convertedUserFileds.education.type instanceof GraphQLList)
  t.deepEqual(convertedUserFileds.education.type.ofType.name, userFileds.education.type.ofType.name)
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
