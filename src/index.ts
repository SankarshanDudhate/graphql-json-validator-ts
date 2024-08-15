import express from 'express'
import { GraphQLScalarType } from 'graphql/type/index.js'
import { loadFilesSync } from '@graphql-tools/load-files'
import { resolvers } from './resolvers'
import { structureDirective } from './structureDirective'
import {createHandler} from "graphql-http/lib/use/express";
import {makeExecutableSchema} from "@graphql-tools/schema";

new GraphQLScalarType({
    name: 'JSON',
    description: 'A valid JSON object',
    serialize: (value) => value,
    parseLiteral: (ast) => JSON.parse(ast.toString()),
    parseValue: (value) => value,
})

export const typeDefinitions = loadFilesSync('src/**/schema.graphql')
export let schema = makeExecutableSchema({
    typeDefs: typeDefinitions,
    resolvers,
})
schema = structureDirective(schema)

const app = express()
app.use(
    '/graphql',
    createHandler({ schema })
)

app.listen(4000)
console.log('Running a GraphQL server. Hit the queries at http://localhost:4000/graphql')
