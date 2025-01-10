import { registerResolver } from "../../resolver/signup";

const resolvers = {
  Query: {},
  Mutation: {
    ...registerResolver.Mutation,
  },
};

export { resolvers };
