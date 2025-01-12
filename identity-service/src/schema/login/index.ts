import { gql } from "apollo-server-express";

const loginTypeDefs = gql`
  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    success: Boolean!
    message: String!
    user: User
    token: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    isAuthenticated: Boolean!
    role: String!
    otp: String
  }

  type Mutation {
    login(input: LoginInput!): LoginResponse!
  }
`;

export { loginTypeDefs };
