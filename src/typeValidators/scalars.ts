import { GraphQLScalarType } from 'graphql'
import { GraphQLTypeValidator } from './graphQLTypeValidator'

declare module 'graphql' {
  interface GraphQLScalarType extends GraphQLTypeValidator {}
}

GraphQLScalarType.prototype.isValidJsValue = function (
  this: GraphQLScalarType,
  value: never,
): boolean {
  try {
    this.serialize(value)
  } catch (e) {
    return false
  }
  return true
}

export {}
