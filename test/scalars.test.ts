import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Scalars', () => {
  describe('Invalid', () => {
    const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryInt: Int!
        }
      `
    it('mandatory field is undefined', async () => {
      const data = {
        mandatoryInt: undefined,
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('mandatory field is null', async () => {
      const data = {
        mandatoryInt: null,
      }
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })
  })

  describe('Valid', () => {
    // QUESTION should this be returned as null or should it be skipped?
    it('optional field is undefined', async () => {
      const data = {
        optionalInt: undefined,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('optional field is null', async () => {
      const data = {
        optionalInt: null,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('mandatory int field', async () => {
      const data = {
        mandatoryInt: 123,
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryInt: Int!
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })
  })
})
