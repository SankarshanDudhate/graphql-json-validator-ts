import {
  getNullableType,
  GraphQLFieldConfig,
  GraphQLNamedType,
  GraphQLObjectType,
  isNonNullType,
  isObjectType,
} from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  defaultErrorExtension,
  JsonStructureDirectiveValidationError,
} from './JsonStructureDirectiveValidationError'
import isNil from 'lodash/isNil'
import { GraphQLScalarType } from 'graphql/type/index.js'

export function validateTargetFieldToBeJSON(
  fieldConfig: GraphQLFieldConfig<any, any>,
  fieldName: string,
) {
  const fieldType = fieldConfig.type.toString()
  if (fieldType !== 'JSON' && fieldType !== 'JSON!')
    throw new JsonStructureDirectiveValidationError(
      `@structure directive cannot be applied to field ${fieldName} of type ${fieldType}`,
      {
        extensions: defaultErrorExtension(fieldName),
      },
    )
}

export function validateAllowedTypesArg(
  gqlType: Maybe<GraphQLNamedType>,
  typeName,
  fieldName: string,
) {
  if (!gqlType)
    throw new JsonStructureDirectiveValidationError(
      `Unknown type ${typeName} passed as an argument for @structure on field ${fieldName}`,
      {
        extensions: defaultErrorExtension(fieldName),
      },
    )
  const isObjectType = gqlType instanceof GraphQLObjectType
  if (!isObjectType)
    throw new JsonStructureDirectiveValidationError(
      `Non-object type ${typeName} specified as an argument for @structure`,
      {
        extensions: defaultErrorExtension(fieldName),
      },
    )
}

const isValidScalar = (value: any, scalarType: GraphQLScalarType) => {
  try {
    scalarType.serialize(value)
  } catch (e) {
    return false
  }
  return true
}
export const isValidObjectOfGqlType = (obj: any, gqlType: GraphQLObjectType) => {
  const fieldMap = gqlType.getFields()
  for (const [fieldName, fieldDescriptor] of Object.entries(fieldMap)) {
    const fieldValue = obj[fieldName]
    if (isNil(fieldValue)) {
      if (isNonNullType(fieldDescriptor.type)) return false
      continue
    }

    const fieldNullableType = getNullableType(fieldDescriptor.type)
    if (isObjectType(fieldNullableType)) {
      if (!isValidObjectOfGqlType(fieldValue, fieldNullableType)) return false
      continue
    }

    if (!isValidScalar(fieldValue, fieldNullableType as GraphQLScalarType)) return false
  }
  return true
}
