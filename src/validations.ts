import { GraphQLFieldConfig, GraphQLNamedType, GraphQLObjectType } from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { JsonStructureDirectiveValidationError } from './JsonStructureDirectiveValidationError'

export function validateTargetFieldToBeJSON(
  fieldConfig: GraphQLFieldConfig<any, any>,
  fieldName: string,
) {
  const fieldType = fieldConfig.type.toString()
  if (fieldType !== 'JSON' && fieldType !== 'JSON!')
    throw new JsonStructureDirectiveValidationError(
      `@structure directive cannot be applied to field ${fieldName} of type ${fieldType}`,
      {
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
          fieldName,
        },
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
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
          fieldName: fieldName,
        },
      },
    )
  const isObjectType = gqlType instanceof GraphQLObjectType
  if (!isObjectType)
    throw new JsonStructureDirectiveValidationError(
      `Non-object type ${typeName} specified as an argument for @structure`,
      {
        extensions: {
          code: 'GRAPHQL_VALIDATION_FAILED',
          fieldName: fieldName,
        },
      },
    )
}
