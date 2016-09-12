import buildArgs from './buildArgs'
import { filterPluralArgs, toMongooseArgs } from '../utils'

/**
 * Build mutation for single model
 * @params
 *  - model a mongoose model
 *  - type a corresponding converted graphql type
 * @return
 *  - {Object} e.g. { createUser: {type: userType, args, resolve}, updateUser, removeUser }
 */
export default function (model, type) {
  const modelName = model.modelName
  const defaultArgs = buildArgs(type)
  return {
    [`create${modelName}`]: buildCreate(model, type, defaultArgs),
    // [`update${modelName}`]: {},
    // [`remove${modelName}`]: {}
  }
}

const buildCreate = (model, type, defaultArgs) => {
  return {
    type,
    args: filterPluralArgs(defaultArgs),
    resolve: async (_, args) => {
      const instance = new model(toMongooseArgs(args))
      return await instance.save()
    }
  }
}
