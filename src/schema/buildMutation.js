import buildArgs from './buildArgs'
import { filterArgs, toMongooseArgs } from '../utils'

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
    [`update${modelName}`]: buildUpdate(model, type, defaultArgs),
    // [`remove${modelName}`]: {}
  }
}

const buildCreate = (model, type, defaultArgs) => {
  return {
    type,
    args: filterArgs(defaultArgs, { id: true, plural: true }),
    resolve: async (_, args) => {
      const instance = new model(toMongooseArgs(args))
      return await instance.save()
    }
  }
}

const buildUpdate = (model, type, defaultArgs) => {
  return {
    type,
    args: filterArgs(defaultArgs, { plural: true, required: true, idRequired: true }),
    resolve: async (_, args) => {
      const updateData = Object.entries(args)
        .filter(([key, _]) => {
          if (key === 'id' || key === 'ids') return false
          return true
        })
        .map(([key, value]) => {
          return [key.replace('_', '.'), value]
        })
        .reduce((args, [key, value]) => (Object.assign(args, {[key]: value})), {})
      await model.update({ _id: args.id }, { $set: updateData })
      return await model.findById(args.id)
    }
  }
}
