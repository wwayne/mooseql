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
  userName: String,
  age: Number,
  isBot: Boolean,
  birth: { type: Date, default: Date.now },
  binary: Buffer,
  info: Schema.Types.Mixed,
  hobbies: [{ type: String }],
  currentSchool: { type: Schema.Types.ObjectId, ref: 'School' },
  education: [{ type: Schema.Types.ObjectId, ref: 'School' }]
})

export const UserModel = mongoose.model('User', userSchema)

/* Graphql User type */
export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    userName: { type: GraphQLString },
    age: { type: GraphQLFloat },
    isBot: { type: GraphQLBoolean },
    birth: { type: GraphQLDate },
    binary: { type: GraphQLBuffer },
    info: { type: GraphQLMixed },
    hobbies: { type: new GraphQLList(GraphQLString) },
    currentSchool: { type: schoolType },
    education: { type: new GraphQLList(schoolType) }
  })
})
