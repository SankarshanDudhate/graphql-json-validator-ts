import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { GraphQLError } from 'graphql/error/index.js'

export function structureDirective(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const structureDirective = getDirective(schema, fieldConfig, 'structure')
      if (structureDirective) {
        const fieldType = fieldConfig.type.toString()
        if (fieldType !== 'JSON')
          throw new GraphQLError(
            `@structure directive cannot be applied to fields of type ${fieldType}`,
          )

        const { allowedTypes } = structureDirective[0]
        allowedTypes.forEach((typeName) => {
          if (!schema.getType(typeName))
            throw new GraphQLError(
              `Unknown type ${typeName} specified as an argument for @structure`,
            )
        })
      }
      return fieldConfig
    },
  })
}
