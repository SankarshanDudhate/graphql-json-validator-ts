import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Enums', () => {
  it('invalid enum value', async () => {
    const data = {
      mandatoryEnum: 'UnknownValue',
    }
    const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryEnum: RoleEnum!
        }
        enum RoleEnum {
          Admin
        }
      `
    const schema = buildTestSchema(data, typeDefs)
    const result = await executeTestQuery(schema, userQuery)
    expect(result.errors?.[0].message).toEqual(
      'Field customJson of type JSON does not match any of the allowed types',
    )
  })

  it('valid enum value', async () => {
    const data = {
      optionalEnum: 'Admin',
    }
    const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          optionalEnum: RoleEnum
        }
        enum RoleEnum {
          Admin
        }
      `
    const schema = buildTestSchema(data, typeDefs)
    const result = await executeTestQuery(schema, userQuery)
    expect(result.errors).toEqual(undefined)
  })
})
