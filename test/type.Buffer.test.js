import test from 'ava'
import { GraphQLBuffer } from '../src/type/customType'
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql'

const buffer = new Buffer('buffer')

test('should handle GraphQLBuffer type', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLBuffer,
          resolve: () => buffer
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.deepEqual(queryRes, { data: { foo: buffer } })
})

test('should return error if type not conform to GraphQLBuffer', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLBuffer,
          resolve: () => 'string'
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.not(queryRes.errors, undefined)
})

test('should be able to use GraphQLBuffer as args type', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLBuffer,
          args: {
            bar: { type: GraphQLBuffer }
          },
          resolve: (_, { bar }) => buffer
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo(bar: ${new Buffer('bar')}) }`)
  t.deepEqual(queryRes, { data: { foo: buffer } })
})

test('should handle null value under GraphQLBuffer', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLBuffer,
          resolve: () => null
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.deepEqual(queryRes, { data: { foo: null } })
})
