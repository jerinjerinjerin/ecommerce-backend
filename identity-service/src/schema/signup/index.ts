import { gql } from "apollo-server-express";
const registerTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    profileUrl: String
    email: String!
    password: String!
    isAuthenticated: Boolean!
    otp: String
    otpExpiredAt: String
    createdAt: String!
  }

  input SignUpInput {
    username: String!
    email: String!
    password: String!
    profileUrl: String!
  }

  type Mutation {
    signUp(input: SignUpInput): User!
    registerUser(input: SignUpInput): User!
  }

  type Query {
    users: [User!]!
  }
`;

export { registerTypeDefs };
