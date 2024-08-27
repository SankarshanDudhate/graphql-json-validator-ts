import { getNullableType, GraphQLScalarType, isLeafType, isType } from 'graphql/type/index.js'
import {
  GraphQLEnumType,
  GraphQLList,
  GraphQLObjectType,
  isListType,
  isNonNullType,
  isObjectType,
} from 'graphql'

export interface GraphQLTypeValidator {
  // eslint-disable-next-line no-unused-vars
  isValidJsValue(value: never): boolean
}

export type TypeWithValidatorAvailable =
  | GraphQLScalarType
  | GraphQLEnumType
  | GraphQLObjectType
  | GraphQLList<any>

export const getTypeWithoutNullability = (type: any) => {
  if (isNonNullType(type)) return getNullableType(type)
  return type
}

export const isOfTypeWithValidatorAvailable = (type: any): type is TypeWithValidatorAvailable => {
  const typeWithoutNullability = getTypeWithoutNullability(type)
  return (
    isListType(typeWithoutNullability) ||
    isObjectType(typeWithoutNullability) ||
    isLeafType(typeWithoutNullability)
  )
}
