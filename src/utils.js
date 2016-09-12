import {GraphQLNonNull} from 'graphql/type'
import pluralize from 'pluralize'

/**
 * Filter plural arguments
 */
export function filterPluralArgs (defaultArgs) {
  return Object.entries(defaultArgs)
    .filter(([arg, value]) => {
      if (arg === 'id' || arg === 'ids') return false
      if (!value.onlyPlural && pluralize.plural(arg) === arg) return false
      return true
    })
    .map(([arg, value]) => {
      if (value.required) value = Object.assign(value, {type: new GraphQLNonNull(value.type)})
      return [arg, value]
    })
    .reduce((args, [arg, value]) => {
      return Object.assign(args, {[arg]: value})
    }, {})
}

/**
 * Convert args that graphql know to the args that mongoose know
 * so that the args can be used by mongoose to find or create
 */
export function toMongooseArgs (args) {
  // Covert name_first to name: {first}
  let keyDepth = []
  return Object.entries(args).reduce((args, [key, value]) => {
    keyDepth = key.split('_')
    if (keyDepth.length === 1) return Object.assign(args, {[key]: value})
    keyDepth.reduce((args, depth, index) => {
      if (index === keyDepth.length - 1) {
        args[depth] = value
        return
      }
      args[depth] = args[depth] || {}
      return args[depth]
    }, args)
    return args
  }, {})
}
