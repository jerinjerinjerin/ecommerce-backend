import { gql } from "apollo-server-express";
import { registerTypeDefs } from "../schema/signup";

const typeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  ${registerTypeDefs}
`;

export { typeDefs };
