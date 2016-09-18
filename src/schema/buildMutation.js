import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString
} from 'graphql'
import buildArgs from './buildArgs'
import { filterArgs, toMongooseArgs, pickoutValue } from '../utils'

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
    [`delete${modelName}`]: buildDelete(model, type, defaultArgs)
  }
}

const buildCreate = (Model, type, defaultArgs) => {
  const createArgs = filterArgs(defaultArgs, { id: true, plural: true })
  const lazyRequiredCheck = Object.entries(createArgs).filter(([key, value]) => {
    return value.required && value.context
  })
  return {
    type,
    args: createArgs,
    resolve: async (root, args, context) => {
      // Check if an arg is required and has context
      // because it won't be marked as GraphqlNonNull
      lazyRequiredCheck.forEach(([key, value]) => {
        const ctx = value.context.split('.')[0]  // user.id -> user
        if (context[ctx] === undefined) throw new Error(`${key} is required`)
        args[key] = pickoutValue(context, value.context)
      })

      const instance = new Model(toMongooseArgs(args))
      return await instance.save()
    }
  }
}

const buildUpdate = (Model, type, defaultArgs) => {
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

      await Model.update({ _id: args.id }, { $set: updateData })
      return await Model.findById(args.id)
    }
  }
}

const buildDelete = (Model, type, defaultArgs) => {
  const returnType = new GraphQLObjectType({
    name: `${Model.modelName}deleteMutationReturn`,
    fields: () => ({
      success: { type: GraphQLBoolean },
      msg: { type: GraphQLString }
    })
  })
  return {
    type: returnType,
    args: filterArgs(defaultArgs, { plural: true, idRequired: true, onlyId: true }),
    resolve: async (_, args) => {
      let res = { success: true, msg: null }
      try {
        await Model.findById(args.id).remove()
      } catch (err) {
        res = { success: false, msg: err.message }
      }
      return res
    }
  }
}
