import { describe, expect, it } from '@jest/globals'
import {
  buildTestSchema,
  executeTestQuery,
  typeDefsWithoutCustomType,
  userQuery,
} from './testUtils'

describe('Scalars', () => {
  it('invalid scalar - different type', async () => {
    const data = {
      mandatoryInt: 'Bla bla',
    }
    const typeDefs = `
        ${typeDefsWithoutCustomType}
        type CustomType {
          mandatoryInt: Boolean
        }
      `
    const schema = buildTestSchema(data, typeDefs)
    const result = await executeTestQuery(schema, userQuery)
    expect(result.errors?.[0].message).toEqual(
      'Field customJson of type JSON does not match any of the allowed types',
    )
  })

  it('valid scalar', async () => {
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

  // TODO add tests that show how different scalar types are coerced
})
