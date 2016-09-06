import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList
} from 'graphql/type'
import {
  GraphQLBuffer,
  GraphQLDate,
  GraphQLMixed
} from './customType'

/**
 * Convert bundch of mongoose model to graphql types
 * @params
 *  - models {Array} list of mongoose models
 * @return
 *  - typeMap {Object} key: modelName, value: type
 */
export function modelsToTypes (models) {
  let typeMap = models.reduce((map, model) => {
    return Object.assign(map, { [model.modelName]: toType(model) })
  }, {})

  // Deal with ref after all types are defined
  Object.entries(typeMap).forEach(([modelName, type]) => {
    const originFileds = type._typeConfig.fields()
    const newTypeFileds = Object.entries(originFileds)
      .map(([path, pathValue]) => {
        if (pathValue.ref) {
          const ref = pathValue.ref
          if (!typeMap[ref]) throw TypeError(`${ref} is not a model`)
          const model = models.find(m => m.modelName === ref)

          if (pathValue.type instanceof GraphQLList) {
            return {[path]: {
              type: new GraphQLList(typeMap[ref]),
              resolve: async (instance) => {
                // TODO: args filter
                return await model.find({ _id: { $in: instance[path] } })
              }
            }}
          } else {
            return {[path]: {
              type: typeMap[ref],
              resolve: async (instance) => {
                return await model.findById(instance[path])
              }
            }}
          }
        }
        return { [path]: pathValue }
      })
      .reduce((typeField, path) => (Object.assign(typeField, path)), {})

    typeMap[modelName] = new GraphQLObjectType({
      name: type.name,
      fields: () => (newTypeFileds)
    })
  })

  return typeMap
}

/* Convert a mongoose model to corresponding type */
const toType = (model) => {
  const exceptPath = ['_id', '__v']
  const paths = model.schema.paths
  const fields = Object.keys(paths)
    .filter(path => exceptPath.indexOf(path) === -1)
    .reduce((fields, path) => {
      const attr = paths[path]
      fields[path] = { type: pathToType(attr) }
      // Find out ref on mongoose model's path, use subPath's ref if path is an Array
      if (attr.options.ref || (attr.instance === 'Array' && attr.caster.options.ref)) {
        fields[path]['ref'] = attr.options.ref || attr.caster.options.ref
      }
      return fields
    }, {
      id: { type: GraphQLID }
    })

  return new GraphQLObjectType({
    name: model.modelName,
    fields: () => (fields)
  })
}

// Convert single path of mongoose to type
const pathToType = (path) => {
  switch (path.instance) {
    case 'String':
      return GraphQLString
    case 'Number':
      // Float includes Int
      // @see https://github.com/graphql/graphql-js/blob/master/src/type/scalars.js#L69
      return GraphQLFloat
    case 'Date':
      return GraphQLDate
    case 'Buffer':
      return GraphQLBuffer
    case 'Boolean':
      return GraphQLBoolean
    case 'Mixed':
      return GraphQLMixed
    case 'ObjectID':
      return GraphQLID
    case 'Array':
      const subType = pathToType(path.caster)
      return new GraphQLList(subType)
    default:
      return GraphQLMixed
  }
}
