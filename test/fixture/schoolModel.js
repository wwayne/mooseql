import mongoose, { Schema } from 'mongoose'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID
} from 'graphql/type'

/* Mongoose School model */
const schoolSchema = new Schema({
  name: { type: String, required: 'name is required' },
  principal: {
    type: String,
    ref: 'User',
    required: true,
    context: 'user.id'
  },
  position: String,
  students: Number
})

export const SchoolModel = mongoose.model('School', schoolSchema)

/* Graphql School type */
export const schoolType = new GraphQLObjectType({
  name: 'School',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString, required: true },
    principal: { type: GraphQLID, ref: 'User', required: true, context: 'user.id' },
    position: { type: GraphQLString },
    students: { type: GraphQLFloat }
  })
})
