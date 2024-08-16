import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLNamedType, GraphQLSchema } from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { validateAllowedTypesArg, validateTargetFieldToBeJSON } from './validations'

export function structureDirective(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName) => {
      const structureDirective = getDirective(schema, fieldConfig, 'structure')
      if (structureDirective) {
        fieldConfig.resolve = (source) => {
          validateTargetFieldToBeJSON(fieldConfig, fieldName)

          const { allowedTypes } = structureDirective[0]
          allowedTypes.map((typeName) => {
            const gqlType: Maybe<GraphQLNamedType> = schema.getType(typeName)
            validateAllowedTypesArg(gqlType, typeName, fieldName)
          })
        }
      }
      return fieldConfig
    },
  })
}
