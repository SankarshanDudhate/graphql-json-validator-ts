import {
  getNullableType,
  GraphQLLeafType,
  GraphQLObjectType,
  isNonNullType,
  isObjectType,
} from 'graphql'
import { GraphQLTypeValidator } from './graphQLTypeValidator'
import isNil from 'lodash/isNil'

declare module 'graphql' {
  interface GraphQLObjectType extends GraphQLTypeValidator {}
}

GraphQLObjectType.prototype.isValidJsValue = function (
  this: GraphQLObjectType,
  value: never,
): boolean {
  const obj = value
  const fieldMap = this.getFields()
  for (const [fieldName, fieldDescriptor] of Object.entries(fieldMap)) {
    const fieldValue = obj[fieldName]
    if (isNil(fieldValue)) {
      if (isNonNullType(fieldDescriptor.type)) return false
      continue
    }

    const fieldNullableType = getNullableType(fieldDescriptor.type)
    if (isObjectType(fieldNullableType)) {
      if (!(fieldNullableType as GraphQLObjectType).isValidJsValue(fieldValue)) return false
      continue
    }

    if (!(fieldNullableType as GraphQLLeafType).isValidJsValue(fieldValue)) return false
  }
  return true
}

export {}
