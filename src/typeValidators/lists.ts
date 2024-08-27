import { GraphQLList } from 'graphql'
import { getTypeWithoutNullability, GraphQLTypeValidator } from './graphQLTypeValidator'
import { GraphQLType } from 'graphql/type/definition'
import { isArray } from 'lodash'

declare module 'graphql' {
  // eslint-disable-next-line no-unused-vars
  interface GraphQLList<T extends GraphQLType> extends GraphQLTypeValidator {}
}

GraphQLList.prototype.isValidJsValue = function (this: GraphQLList<any>, value: never): boolean {
  if (!isArray(value)) return false
  const valueAsArray = value as Array<any>
  const childType = getTypeWithoutNullability(this.ofType)
  const areAllElementsValid = valueAsArray.every((arrayElem) => {
    return childType.isValidJsValue(arrayElem)
  })
  return areAllElementsValid
}

export {}
