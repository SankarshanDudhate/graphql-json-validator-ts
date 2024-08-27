import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Objects', () => {
  describe('Valid', () => {
    it('empty list', async () => {
      const data = {
        optionalList: [],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [Int]
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('list of scalars', async () => {
      const data = {
        optionalList: [true, false],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [Boolean]
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('list of objects', async () => {
      const data = {
        mandatoryList: [{ nestedInt: 5 }],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryList: [SomeObjectType!]!
        }
        type SomeObjectType {
          nestedInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })

    it('list of lists', async () => {
      const data = {
        optionalList: [
          [11, 12],
          [1, 2],
        ],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [[Int]]
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors).toEqual(undefined)
    })
  })

  describe('Invalid', () => {
    it('not a list', async () => {
      const data = {
        optionalList: 'bla',
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [Boolean]
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('scalar list containing incompatible scalar value', async () => {
      const data = {
        optionalList: [true, 'bla'],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [Boolean]
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('enum list containing invalid enum value', async () => {
      const data = {
        optionalList: ['SomeEnumValue', 'bla'],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [SomeEnum]
        }
        enum SomeEnum {
          SomeEnumValue
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('objects list containing incompatible object value', async () => {
      const data = {
        optionalList: [{ nestedInt: 5 }, { nestedInt: 'Bla' }],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalList: [SomeObjectType]
        }
        type SomeObjectType {
          nestedInt: Int
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })

    it('list of mandatory children containing null', async () => {
      const data = {
        mandatoryList: [true, null],
      }
      const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryList: [Boolean!]
        }
      `
      const schema = buildTestSchema(data, typeDefs)
      const result = await executeTestQuery(schema, userQuery)
      expect(result.errors?.[0].message).toEqual(
        'Field customJson of type JSON does not match any of the allowed types',
      )
    })
  })
})
