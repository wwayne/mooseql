import { modelsToTypes } from './type'
import { buildSchema } from './schema'

export default function (models, customFields, opt) {
  const typeMap = modelsToTypes(models)
  const schema = buildSchema(models, typeMap)
}
