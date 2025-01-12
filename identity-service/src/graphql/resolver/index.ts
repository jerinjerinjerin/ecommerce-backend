// resolvers.ts
import { loginResolver } from "../../resolver/login";
import { registerResolver } from "../../resolver/signup";

const resolvers = {
  Query: {},
  Mutation: {
    ...registerResolver.Mutation,
    ...loginResolver.Mutation,
  },
};

export { resolvers };
