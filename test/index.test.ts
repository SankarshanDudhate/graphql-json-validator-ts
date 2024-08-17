import { describe, expect, it } from '@jest/globals'
import { structureDirective } from '../src/structureDirective'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { buildTestSchema, executeTestQuery } from './testUtils'

describe('Directive sanity', () => {
  it('should throw when applying directive on non-JSON types', async () => {
    const typeDefs = `
        scalar JSON
        directive @structure(allowedTypes: [String!]) on FIELD_DEFINITION
        type Query {
          user: User
        }
        type User {
          name: String @structure(allowedTypes: ["CustomType"])
          customJson: JSON
        }
        type CustomType {
          optionalInt: Int
        }
      `
    const resolvers = {
      Query: {
        user: () => ({
          customJson: {
            optionalInt: '2024',
          },
          name: 'Name',
        }),
      },
    }
    const schema = structureDirective(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
    )
    const userQuery = `
        query {
          user {
            customJson
            name
          }
        }
      `

    const result = await executeTestQuery(schema, userQuery)
    expect(result.errors?.[0].message).toEqual(
      '@structure directive cannot be applied to field name of type String',
    )
    expect(result.errors?.[0].extensions).toEqual({
      code: 'GRAPHQL_VALIDATION_FAILED',
      fieldName: 'name',
    })
  })

  it('should throw when type provided as argument is not defined', async () => {
    const typeDefs = `
        scalar JSON
        directive @structure(allowedTypes: [String!]) on FIELD_DEFINITION
        type Query {
          user: User
        }
        type User {
          customJson: JSON @structure(allowedTypes: ["UnknownType"])
        }
        type CustomType {
          optionalInt: Int
        }
      `
    const data = {
      optionalInt: '2024',
    }
    const schema = buildTestSchema(data, typeDefs)
    const userQuery = `
        query {
          user {
            customJson
          }
        }
      `

    const result = await executeTestQuery(schema, userQuery)
    expect(result.errors?.[0].message).toEqual(
      'Unknown type UnknownType passed as an argument for @structure on field customJson',
    )
    expect(result.errors?.[0].extensions).toEqual({
      code: 'GRAPHQL_VALIDATION_FAILED',
      fieldName: 'customJson',
    })
  })

  it('should throw when an allowed type is not object type', async () => {
    const typeDefs = `
        scalar JSON
        directive @structure(allowedTypes: [String!]) on FIELD_DEFINITION
        type Query {
          user: User
        }
        type User {
          customJson: JSON @structure(allowedTypes: ["String"])
        }
      `
    const data = {
      optionalInt: '2024',
    }
    const schema = buildTestSchema(data, typeDefs)
    const userQuery = `
        query {
          user {
            customJson
          }
        }
      `

    const result = await executeTestQuery(schema, userQuery)
    expect(result.errors?.[0].message).toEqual(
      'Non-object type String specified as an argument for @structure',
    )
    expect(result.errors?.[0].extensions).toEqual({
      code: 'GRAPHQL_VALIDATION_FAILED',
      fieldName: 'customJson',
    })
  })
})
