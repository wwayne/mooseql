import test from 'ava'
import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql'
import mongoose from 'mongoose'

import { UserModel } from './fixture/userModel'
import { SchoolModel } from './fixture/schoolModel'
import { modelsToTypes } from '../src/type'
import buildQuery from '../src/schema/buildQuery'

let school
let user
let user2
let userSchema
test.before(async t => {
  mongoose.connect('mongodb://localhost/test')

  const typeMap = modelsToTypes([UserModel, SchoolModel])
  const userQueryField = buildQuery(UserModel, typeMap['User'])
  userSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: userQueryField
    })
  })
  school = new SchoolModel({
    name: 'universary',
    principal: 'wayne',
    position: 'sh',
    students: 100
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
  user2 = new UserModel({
    userName: 'jtc',
    name: { first: 'cheng' },
    age: 24.5,
    isBot: false,
    birth: new Date(1992, 3, 3),
    binary: new Buffer('cjt'),
    info: 'anything',
    hobbies: ['drawing', 'travelling'],
    currentSchool: school.id,
    education: [school.id]
  })
  await user.save()
  await user2.save()
  await school.save()
})

test.after(async t => {
  await UserModel.find({ _id: { $in: [user.id, user2.id] } }).remove()
  await SchoolModel.findByIdAndRemove(school.id)
})

test('should support find by id for each every model', async t => {
  const queryRes = await graphql(userSchema, `{ user(id: "${user.id}") { id } }`)
  t.is(queryRes.data.user[0].id, user.id)
})
test('should support find a group of instance by ids for every model', async t => {
  const queryRes = await graphql(userSchema, `{ user(ids: ["${user.id}", "${user2.id}"]) { id } }`)
  t.is(queryRes.data.user[0].id, user.id)
  t.is(queryRes.data.user[1].id, user2.id)
})
test('should support find by Object attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(name_first: "${user.name.first}") { name { first } } }`)
  t.is(queryRes.data.user[0].name.first, user.name.first)
})
test('should support find a group of Object attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(name_firsts: ["${user.name.first}", "${user2.name.first}"]) { name { first } } }`)
  t.is(queryRes.data.user[0].name.first, user.name.first)
  t.is(queryRes.data.user[1].name.first, user2.name.first)
})
test('should support find by String attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(userName: "${user.userName}") { userName } }`)
  t.is(queryRes.data.user[0].userName, user.userName)
})
test('should support find a group of String attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(userNames: ["${user.userName}", "${user2.userName}"]) { userName } }`)
  t.is(queryRes.data.user[0].userName, user.userName)
  t.is(queryRes.data.user[1].userName, user2.userName)
})
test('should support find by Number attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(age: ${user.age}) { age } }`)
  t.is(queryRes.data.user[0].age, user.age)
})
test('should support find a group of Number attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(ages: [${user.age}, ${user2.age}]) { age } }`)
  t.is(queryRes.data.user[0].age, user.age)
  t.is(queryRes.data.user[1].age, user2.age)
})
test('should support find by Bool attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(isBot: ${user.isBot}) { isBot } }`)
  t.is(queryRes.data.user[0].isBot, user.isBot)
})
test('should support find a group of Bool attribute of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(isBots: [${user.isBot}, ${user2.isBot}]) { isBot } }`)
  t.is(queryRes.data.user[0].isBot, user.isBot)
  t.is(queryRes.data.user[1].isBot, user2.isBot)
})
test('should support find by Date attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(birth: "${user.birth}") { birth } }`)
  t.deepEqual(queryRes.data.user[0].birth, user.birth)
})
test('should support find a group of Date attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(births: ["${user.birth}", "${user2.birth}"]) { birth } }`)
  t.deepEqual(queryRes.data.user[0].birth, user.birth)
  t.deepEqual(queryRes.data.user[1].birth, user2.birth)
})
test('should support find by Buffer attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(binary: "${user.binary}") { binary } }`)
  t.deepEqual(queryRes.data.user[0].binary, user.binary)
})
test('should support find a group of Buffer attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(binaries: ["${user.binary}", "${user2.binary}"]) { binary } }`)
  t.deepEqual(queryRes.data.user[0].binary, user.binary)
  t.deepEqual(queryRes.data.user[1].binary, user2.binary)
})
test('should support find by Array attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(hobbies: ["${user.hobbies[0]}", "${user.hobbies[1]}"]) { hobbies } }`)
  t.is(queryRes.data.user[0].hobbies.length, user.hobbies.length)
  t.is(queryRes.data.user[0].hobbies[0], user.hobbies[0])
  t.is(queryRes.data.user[0].hobbies[1], user.hobbies[1])
})
test('should support find by Ref ID attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(currentSchool: "${user.currentSchool}") { currentSchool {id} } }`)
  t.is(queryRes.data.user[0].currentSchool.id.toString(), user.currentSchool.toString())
})
test('should support find a group of Ref ID attrube of the origin model', async t => {
  const queryRes = await graphql(
    userSchema,
    `{ user(currentSchools: ["${user.currentSchool}", "${user2.currentSchool}"]) { currentSchool {id} } }`
  )
  t.is(queryRes.data.user[0].currentSchool.id.toString(), user.currentSchool.toString())
  t.is(queryRes.data.user[1].currentSchool.id.toString(), user2.currentSchool.toString())
})
test('should support find by Array of Ref ID attrube of the origin model', async t => {
  const queryRes = await graphql(userSchema, `{ user(education: ["${user.education[0]}"]) { education {id} } }`)
  t.is(queryRes.data.user[0].education[0].id.toString(), user.education[0].toString())
})
test('should be able to query with a set of args when they are giving in valid format', async t => {
  const queryRes = await graphql(
    userSchema,
    `{ user(id: "${user.id}" name_first: "${user.name.first}" age: ${user.age} hobbies: ["${user.hobbies[0]}", "${user.hobbies[1]}"]) { id } }`
  )
  t.is(queryRes.data.user[0].id, user.id)
})
test('should response with errors when giving invalid params', async t => {
  const queryRes = await graphql(userSchema, `{ user(id: "true") { id } }`)
  t.not(queryRes.errors, undefined)
})
test('should return all instance when args not provided', async t => {
  const queryRes = await graphql(userSchema, `{ user { id } }`)
  t.is(queryRes.data.user.length, 2)
})
