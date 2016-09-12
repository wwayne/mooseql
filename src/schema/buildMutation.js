

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
  return {
    [`create${modelName}`]: ,
    [`update${modelName}`]: {},
    [`remove${modelName}`]: {}
  }
}


