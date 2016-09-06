import { GraphQLScalarType } from 'graphql'

/**
 * Buffer type
 */
const coerceBuffer = (value) => {
  if (value instanceof Buffer) return value
  throw new TypeError(`Type error: ${value} is not instance of Buffer`)
}

export const GraphQLBuffer = new GraphQLScalarType({
  name: 'Buffer',
  serialize: coerceBuffer, // serialize to query result
  parseValue: coerceBuffer,
  parseLiteral: ast => {
    // Read from args
    return typeof ast.value === 'string' && new Buffer(ast.value) || null
  }
})

/**
 * Date type
 */
const coerceDate = (value) => {
  if (value instanceof Date) return value
  throw new TypeError(`Type error: ${value} is not instance of Date`)
}

export const GraphQLDate = new GraphQLScalarType({
  name: 'Date',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: ast => {
    const d = new Date(ast.value)
    return !isNaN(d.getTime()) && d || null
  }
})

/**
 * Mixed type
 */
export const GraphQLMixed = new GraphQLScalarType({
  name: 'Mixed',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: ast => ast.value
})
