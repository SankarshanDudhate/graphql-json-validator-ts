import { GraphQLEnumType } from 'graphql'
import { GraphQLTypeValidator } from './graphQLTypeValidator'

declare module 'graphql' {
  interface GraphQLEnumType extends GraphQLTypeValidator {}
}

GraphQLEnumType.prototype.isValidJsValue = function (this: GraphQLEnumType, value: never): boolean {
  try {
    this.serialize(value)
  } catch (e) {
    return false
  }
  return true
}

export {}
