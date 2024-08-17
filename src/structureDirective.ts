import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLNamedType, GraphQLObjectType, GraphQLSchema } from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import {
  isValidObjectOfGqlType,
  validateAllowedTypesArg,
  validateTargetFieldToBeJSON,
} from './validations'
import { JsonStructureDirectiveValidationError } from './JsonStructureDirectiveValidationError'

export function structureDirective(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName) => {
      const structureDirective = getDirective(schema, fieldConfig, 'structure')
      if (structureDirective) {
        fieldConfig.resolve = (source, args, context, info) => {
          validateTargetFieldToBeJSON(fieldConfig, fieldName)

          const { allowedTypes } = structureDirective[0]
          const matchesAnyAllowedType: string = allowedTypes.find((typeName) => {
            const gqlType: Maybe<GraphQLNamedType> = schema.getType(typeName)
            validateAllowedTypesArg(gqlType, typeName, fieldName)
            return isValidObjectOfGqlType(source[fieldName], gqlType as GraphQLObjectType)
          })
          if (!matchesAnyAllowedType)
            throw new JsonStructureDirectiveValidationError(
              `Field ${fieldName} of type JSON does not match any of the allowed types`,
            )
          return source[fieldName]
        }
      }
      return fieldConfig
    },
  })
}
