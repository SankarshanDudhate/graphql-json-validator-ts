export const resolvers = {
  Query: {
    user: (parent, args, context, info) => ({
      dob: { year: 2024},
      name: 'Foo',
    }),
  },
}
