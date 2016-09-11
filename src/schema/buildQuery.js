import {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} from 'graphql/type'
import {
  GraphQLBuffer,
  GraphQLDate
} from '../type/customType'
import pluralize from 'pluralize'

/**
 * Build query for a sigle model
 * @params
 *  - model a mongoose model
 *  - type a corresponding converted graphql type
 * @return
 *  - {Object} e.g. { user: {type: userType, args: {id, ids, userName, userNames...}, resolve} }
 */
export default function (model, type) {
  const modelName = model.modelName
  const defaultArgs = generateArgs(type._typeConfig.fields())
  return {
    [modelName.toLowerCase()]: {
      type: new GraphQLList(type),
      args: defaultArgs,
      resolve: async (_, args) => {
        if (hasRepeateArgs(Object.keys(args))) {
          throw new Error('Can not use singular and plural of an argument in same time')
        }
        let onlyPlural
        const query = Object.entries(args).map(([arg, value]) => {
          onlyPlural = defaultArgs[arg]['onlyPlural']
          arg = arg.replace('_', '.')
          arg = (arg === 'id' && '_id') || (arg === 'ids' && '_ids') || arg
          if (pluralize.singular(arg) === arg || onlyPlural) {
            return { [arg]: value }
          } else {
            return { [pluralize.singular(arg)]: { $in: value } }
          }
        }).reduce((query, item) => (Object.assign(query, item)), {})
        const res = await model.find(query)
        return res
      }
    }
  }
}

// Generate args based on type's fields
const generateArgs = (fields) => {
  return Object.entries(fields)
    .reduce((args, [key, field]) => {
      return Object.assign(args, fieldToArg(key, field))
    }, {})
}

const fieldToArg = (key, field) => {
  const typeName = field.type.name || field.type.constructor.name
  let graphqlType
  if (typeName !== 'GraphQLList') {
    graphqlType = nameToType(typeName, field)
    // Custom type for Object attribute in mongoose model. e.g. {name: {first, last}}
    if (!graphqlType) return buildObjectArgs(key, field)
    return buildArgs(key, graphqlType)
  } else {
    graphqlType = nameToType(field.type.ofType.name, field)
    return {[key]: { type: new GraphQLList(graphqlType), onlyPlural: true }}
  }
}

const buildArgs = (key, graphqlType) => {
  if (Object.keys(graphqlType).length === 0) return {}
  const plural = pluralize.plural(key)
  const isPlural = plural === key
  return isPlural
    ? {[key]: { type: new GraphQLList(graphqlType) }}
    : {[key]: { type: graphqlType }, [plural]: { type: new GraphQLList(graphqlType) }}
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
      if (hasResolve) return GraphQLID // other model type
      return null // Object attribute in mongoose model
  }
}

// Valid if both singular and plural of a argument were provided
let elem
const hasRepeateArgs = (args) => {
  if (args.length === 0) return false
  elem = args.pop()
  if (args.find(arg => arg === pluralize.plural(elem) || arg === pluralize.singular(elem))) return true
  return hasRepeateArgs(args)
}

// Build args for Object attribute of the mongoose model
const buildObjectArgs = (parentKey, field) => {
  const fields = field.type._typeConfig.fields()
  return Object.entries(fields).map(([key, value]) => {
    return fieldToArg(`${parentKey}_${key}`, value)
  }).reduce((args, myArg) => (Object.assign(args, myArg)), {})
}
