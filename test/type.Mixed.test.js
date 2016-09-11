import test from 'ava'
import { GraphQLMixed } from '../src/type/customType'
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql'

const mixed = {any: { thing: 'mix' }}

test('should handle anything as GraphQLMixed type', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLMixed,
          resolve: () => mixed
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.deepEqual(queryRes, { data: { foo: mixed } })
})

test('should handle null value under GraphQLMixed', async t => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQuery',
      fields: {
        foo: {
          type: GraphQLMixed,
          resolve: () => null
        }
      }
    })
  })
  const queryRes = await graphql(schema, `{ foo }`)
  t.deepEqual(queryRes, { data: { foo: null } })
})
