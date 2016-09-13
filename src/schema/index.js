import buildQuery from './buildQuery'
import buildMutation from './buildMutation'

/**
 * Build graphql CRUD schema based on models and types
 * @params
 *  - models {Array} mongoose models
 *  - typeMap {Object} map of model and corresponding graphql type
 * @return
 *  - grapqhl schema which has query and mutation
 */
export function buildSchema (models, typeMap) {
  let type
  const {query, mutation} = models.map(model => {
    type = typeMap[model.modelName]
    return {
      query: buildQuery(model, type),
      mutation: buildMutation(model, type)
    }
  }).reduce((fields, modelField) => {
    fields.query = Object.assign({}, fields.query, modelField.query)
    fields.mutation = Object.assign({}, fields.mutation, modelField.mutation)
    return fields
  }, { query: {}, mutation: {} })

  return {
    query,
    mutation
  }
}
