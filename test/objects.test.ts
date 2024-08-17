import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Objects', () => {
  describe('Invalid', () => {
    it('mandatory object is undefined', async () => {
      const data = {
        mandatoryObject: undefined,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject!
        }
        type MandatoryObject {
          optionalInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('mandatory object is null', async () => {
      const data = {
        mandatoryObject: null,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject!
        }
        type MandatoryObject {
          optionalInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

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
  })
  describe('Valid', () => {
    it('mandatory object is undefined', async () => {
      const data = {
        mandatoryObject: undefined,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryObject: MandatoryObject
        }
        type MandatoryObject {
          optionalInt: Int!
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('mandatory object is null', async () => {
      const data = {
        mandatoryObject: null,
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
