import {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} from 'graphql'
import {
  GraphQLBuffer,
  GraphQLDate
} from '../type/customType'
import pluralize from 'pluralize'

/**
 * Generate args based on type's fields
 * @parmas
 *  - type {Object} built graphql type
 * @return
 *  - defaultArgs {Object} argus based on type's fields, including singular and plural
 * @notice
 *  - response has `id` and `ids` instead of _id
 *    mongoose query should convert id to _id or mongoose won't support it
 *  - name.first in Mongoose model will have args 'name_first' and 'name_firsts'
 *    because graphql name convention only support _a-zA-Z0-9
 */
export default function (type) {
  const fields = type._typeConfig.fields()
  return Object.entries(fields)
    .reduce((args, [key, field]) => {
      return Object.assign(args, fieldToArg(key, field))
    }, {})
}

const fieldToArg = (key, field) => {
  const typeName = field.type.name || field.type.constructor.name
  const { required, ref, context } = field
  let graphqlType
  if (typeName !== 'GraphQLList') {
    graphqlType = nameToType(typeName, field)
    // Custom type for Object attribute in mongoose model. e.g. {name: {first, last}}
    if (!graphqlType) return buildObjectArgs(key, field)
    return buildArgs(key, graphqlType, { required, ref, context })
  } else {
    // Deal with List type
    graphqlType = nameToType(field.type.ofType.name, field)
    return {[key]: { type: new GraphQLList(graphqlType), onlyPlural: true, required, ref, context }}
  }
}

const buildArgs = (key, graphqlType, { required, ref, context }) => {
  if (Object.keys(graphqlType).length === 0) return {}
  const plural = pluralize.plural(key)
  const isPlural = plural === key
  return isPlural
    ? {[key]: { type: new GraphQLList(graphqlType), onlyPlural: true, required, ref, context }}
    : {[key]: { type: graphqlType, required, ref, context }, [plural]: { type: new GraphQLList(graphqlType) }}
}

const nameToType = (typeName, field) => {
  const hasResolve = !!field.resolve
  switch (typeName) {
    case 'ID': return GraphQLID
    case 'String': return GraphQLString
    case 'Float': return GraphQLFloat
    case 'Boolean': return GraphQLBoolean
    case 'Buffer': return GraphQLBuffer
    case 'Date': return GraphQLDate
    case 'Mixed': return {}
    default:
      if (hasResolve) return GraphQLID // other models, use ID as reference
      return null // Object attribute in mongoose model
  }
}

// Build args for Object attribute of the mongoose model
const buildObjectArgs = (parentKey, field) => {
  const fields = field.type._typeConfig.fields()
  return Object.entries(fields).map(([key, value]) => {
    return fieldToArg(`${parentKey}_${key}`, value)
  }).reduce((args, myArg) => (Object.assign(args, myArg)), {})
}
