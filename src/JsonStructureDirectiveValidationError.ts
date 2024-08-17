import { GraphQLError } from 'graphql/error'
import { Maybe } from 'graphql/jsutils/Maybe'
import { ASTNode } from 'graphql/language/ast'
import { Source } from 'graphql/language/source'

type JsonStructureDirectiveValidationErrorExtension = {
  code?: string
  fieldName?: string
}
type OptionalArgs = {
  nodes?: Maybe<ReadonlyArray<ASTNode> | ASTNode>
  source?: Maybe<Source>
  positions?: Maybe<ReadonlyArray<number>>
  path?: Maybe<ReadonlyArray<string | number>>
  originalError?: Maybe<Error>
  extensions?: JsonStructureDirectiveValidationErrorExtension
}

export class JsonStructureDirectiveValidationError extends GraphQLError {
  constructor(message: string, optionalArgs?: OptionalArgs) {
    super(
      message,
      optionalArgs?.nodes,
      optionalArgs?.source,
      optionalArgs?.positions,
      optionalArgs?.path,
      optionalArgs?.originalError,
      optionalArgs?.extensions,
    )
  }
}

export const defaultErrorExtension = (fieldName: string) => ({
  code: 'GRAPHQL_VALIDATION_FAILED',
  fieldName: fieldName,
})
