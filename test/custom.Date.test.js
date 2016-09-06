import test from 'ava'
import { GraphQLDate } from '../src/type/customType'
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql'

const date = new Date()

test('should handle GraphQLDate type', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLDate,
          resolve: () => date
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.deepEqual(queryRes, { data: { foo: date } })
})

test('should return error if type not conform to GraphQLDate', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLDate,
          resolve: () => 123
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.not(queryRes.errors, undefined)
})

test('should be able to use GraphQLDate as args type', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLDate,
          args: {
            bar: { type: GraphQLDate }
          },
          resolve: (_, { bar }) => date
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo(bar: "${new Date()}") }`)
  t.deepEqual(queryRes, { data: { foo: date } })
})

test('should handle null value under GraphQLDate', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLDate,
          resolve: () => null
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.deepEqual(queryRes, { data: { foo: null } })
})
