import { GraphQLList } from 'graphql'
import pluralize from 'pluralize'
import buildArgs from './buildArgs'

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
  const defaultArgs = buildArgs(type)
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

        return await model.find(query)
      }
    }
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
