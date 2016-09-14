import express from 'express'
import graphqlHTTP from 'express-graphql'
import {
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} from 'graphql'

import mooseql, { buildTypes } from '../../src'
import { UserModel } from './userModel'
import { SchoolModel } from './schoolModel'

export default function () {
  return new Promise((resolve, reject) => {
    const app = express()
    const typeMap = buildTypes([UserModel, SchoolModel])
    const mySchema = mooseql([UserModel, SchoolModel], {
      mutation: {
        customAddUser: {
          type: typeMap['User'],
          args: {
            userName: { type: new GraphQLNonNull(GraphQLString) },
            hobbies: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
            age: { type: new GraphQLNonNull(GraphQLFloat) }
          },
          resolve: async (_, args) => {
            const instance = new UserModel(args)
            return await instance.save()
          }
        }
      }
    })

    app.use('/graphql', graphqlHTTP({
      schema: mySchema,
      graphiql: false
    }))
    app.listen(3000, (err) => {
      if (err) return reject(err)
      resolve(app)
    })
  })
}
