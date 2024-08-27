import { getNullableType, GraphQLObjectType, isNonNullType } from 'graphql'
import {
  GraphQLTypeValidator,
  isOfTypeWithValidatorAvailable,
  TypeWithValidatorAvailable,
} from './graphQLTypeValidator'
import isNil from 'lodash/isNil'
import { JsonStructureDirectiveValidationError } from '../JsonStructureDirectiveValidationError'

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
    let fieldType = fieldDescriptor.type

    if (!isOfTypeWithValidatorAvailable(fieldType))
      throw new JsonStructureDirectiveValidationError(
        `Field ${fieldName} got an invalid type ${fieldType}`,
      )

    if (isNil(fieldValue)) {
      if (isNonNullType(fieldType)) return false
      continue
    }
    if (isNonNullType(fieldType)) {
      fieldType = getNullableType(fieldType)
    }

    if (!(fieldType as TypeWithValidatorAvailable).isValidJsValue(fieldValue)) return false
  }
  return true
}

export {}
