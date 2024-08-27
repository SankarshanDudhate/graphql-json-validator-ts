import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Objects', () => {
  describe('Invalid', () => {
    it('nested object with null mandatory field', async () => {
      const data = {
        mandatoryObject: {
          mandatoryInt: null,
        },
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject!
        }
        type MandatoryObject {
          mandatoryInt: Int!
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('empty object with nested mandatory field', async () => {
      const data = {}
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject!
        }
        type MandatoryObject {
          mandatoryInt: Int!
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('object with a field not of a validated type', async () => {
      const data = {
        mandatoryObject: {
          mandatoryInterface: {
            someIntField: 5,
          },
        },
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject!
        }
        type MandatoryObject {
          mandatoryInterface: SomeInterface
        }
        interface SomeInterface {
          someIntField: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field mandatoryInterface got an invalid type SomeInterface',
      )
    })
  })

  describe('Valid', () => {
    it('nested object with null optional field', async () => {
      const data = {
        mandatoryObject: {
          optionalInt: null,
        },
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject
        }
        type MandatoryObject {
          optionalInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('valid nested object', async () => {
      const data = {
        mandatoryObject: {
          mandatoryInt: 123,
          mandatoryEnum: 'Admin',
        },
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject
        }
        type MandatoryObject {
          mandatoryInt: Int!
          mandatoryEnum: RoleEnum!
        }
        enum RoleEnum {
          Admin
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
      expect(result.data?.user).toEqual({
        customJson: {
          mandatoryObject: {
            mandatoryInt: 123,
            mandatoryEnum: 'Admin',
          },
        },
      })
    })
  })
})
