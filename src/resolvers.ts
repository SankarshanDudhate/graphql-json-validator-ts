export const resolvers = {
  Query: {
    user: (parent, args, context, info) => ({
      dob: { year: undefined },
      name: false,
    }),
  },
}
