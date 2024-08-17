import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Enums', () => {
  describe('Invalid', () => {
    const typeDefs = `
      ${typeDefsWithoutCustomType}
      type CustomType {
        mandatoryEnum: RoleEnum!
      }
      enum RoleEnum {
        Admin
      }
    `
    it('mandatory field is undefined', async () => {
      const data = {
        mandatoryEnum: undefined,
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('mandatory field is null', async () => {
      const data = {
        mandatoryEnum: null,
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('invalid enum value', async () => {
      const data = {
        mandatoryEnum: 'UnknownValue',
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })
  })

  describe('Valid', () => {
    const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalEnum: RoleEnum
        }
        enum RoleEnum {
        Admin
      }
      `
    it('optional field is undefined', async () => {
      const data = {
        optionalEnum: undefined,
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('optional field is null', async () => {
      const data = {
        optionalEnum: null,
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('valid enum value', async () => {
      const data = {
        optionalEnum: 'Admin',
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })
  })
})
