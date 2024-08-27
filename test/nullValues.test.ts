import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Null values', () => {
  describe('Mandatory fields', () => {
    const testTable = [
      ['Int', ''],
      ['RoleEnum', 'enum RoleEnum { Admin }'],
      ['MandatoryObject', 'type MandatoryObject { someField: String }'],
      ['[Boolean]', ''],
    ]

    it.each(testTable)('when undefined', async (typeName: string, additionalTypeDef: string) => {
      const data = {
        mandatoryField: undefined,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryField: ${typeName}!
        }
        ${additionalTypeDef}
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it.each(testTable)('when null', async (typeName: string, additionalTypeDef: string) => {
      const data = {
        mandatoryField: null,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryField: ${typeName}!
        }
        ${additionalTypeDef}
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })
  })

  describe('Optional fields', () => {
    // QUESTION should this be returned as null or should it be skipped?
    const testTable = [
      ['Int', ''],
      ['RoleEnum', 'enum RoleEnum { Admin }'],
      ['OptionalObject', 'type OptionalObject { someField: String }'],
      ['[Boolean]', ''],
    ]

    it.each(testTable)('when undefined', async (typeName: string, additionalTypeDef: string) => {
      const data = {
        optionalField: undefined,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalField: ${typeName}
        }
        ${additionalTypeDef}
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it.each(testTable)('when null', async (typeName: string, additionalTypeDef: string) => {
      const data = {
        optionalField: null,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalField: ${typeName}
        }
        ${additionalTypeDef}
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })
  })
})
