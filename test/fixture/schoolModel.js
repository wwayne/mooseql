import mongoose, { Schema } from 'mongoose'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLID
} from 'graphql/type'

/* Mongoose School model */
const schoolSchema = new Schema({
  name: String,
  position: String,
  students: Number
})

export const SchoolModel = mongoose.model('School', schoolSchema)

/* Graphql School type */
export const schoolType = new GraphQLObjectType({
  name: 'School',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    position: { type: GraphQLString },
    students: { type: GraphQLFloat }
  })
})
