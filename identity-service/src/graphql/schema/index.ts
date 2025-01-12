import { gql } from "apollo-server-express";
import { registerTypeDefs } from "../../schema/signup";
import { loginTypeDefs } from "../../schema/login";

const typeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  ${registerTypeDefs}
  ${loginTypeDefs}
`;

export { typeDefs };
