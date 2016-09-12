import mongoose, { Schema } from 'mongoose'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList
} from 'graphql/type'
import {
  GraphQLBuffer,
  GraphQLDate,
  GraphQLMixed
} from '../../src/type/customType'
import { schoolType } from './schoolModel'

/* Mongoose User model */
const userSchema = new Schema({
  name: {
    first: String,
    last: {
      fst: String,
      snd: Number
    }
  },
  userName: { type: String, required: [true, 'userName is required']},
  age: Number,
  isBot: Boolean,
  birth: { type: Date, default: Date.now },
  binary: Buffer,
  info: Schema.Types.Mixed,
  hobbies: { type: [String], required: 'hobbies should have one at least' },
  currentSchool: { type: Schema.Types.ObjectId, ref: 'School' },
  education: [{ type: Schema.Types.ObjectId, ref: 'School' }]
})

export const UserModel = mongoose.model('User', userSchema)

/* Graphql User type */
export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: {
      type: new GraphQLObjectType({
        name: 'Username',
        fields: () => ({
          first: { type: GraphQLString },
          last: {
            type: new GraphQLObjectType({
              name: 'Usernamelast',
              fields: () => ({
                fst: { type: GraphQLString },
                snd: { type: GraphQLFloat }
              })
            })
          }
        })
      })
    },
    userName: { type: GraphQLString, required: true },
    age: { type: GraphQLFloat },
    isBot: { type: GraphQLBoolean },
    birth: { type: GraphQLDate },
    binary: { type: GraphQLBuffer },
    info: { type: GraphQLMixed },
    hobbies: { type: new GraphQLList(GraphQLString), required: true },
    currentSchool: { type: schoolType, resolve: () => {} },
    education: { type: new GraphQLList(schoolType), resolve: () => {} }
  })
})
