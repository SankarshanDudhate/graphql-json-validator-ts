import { structureDirective } from '../src/structureDirective'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphql, GraphQLSchema } from 'graphql'

export const buildTestSchema = (data: any, typeDefs: string) => {
  const resolvers = {
    Query: {
      user: () => ({
        customJson: data,
      }),
    },
  }
  return structureDirective(
    makeExecutableSchema({
      typeDefs: typeDefs,
      resolvers,
    }),
  )
}
export const executeTestQuery = (schema: GraphQLSchema, query: string) =>
  graphql({
    schema,
    source: query,
    rootValue: {},
  })
export const userQuery = `
  query {
    user {
      customJson
    }
  }
`
export const typeDefsWithoutCustomType = `
  scalar JSON
  directive @structure(allowedTypes: [String!]) on FIELD_DEFINITION
  type Query {
    user: User
  }
  type User {
    name: String
    customJson: JSON @structure(allowedTypes: ["CustomType"])
  }
`
