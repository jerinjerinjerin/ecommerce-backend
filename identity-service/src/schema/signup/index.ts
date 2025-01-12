import { gql } from "apollo-server-express";

const registerTypeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    username: String!
    profileUrl: String
    email: String!
    password: String
    isAuthenticated: Boolean!
    otp: String
    otpExpiredAt: String
    createdAt: String!
    updatedAt: String!
    role: String!
  }

  input SignUpInput {
    username: String!
    email: String!
    password: String!
    profileUrl: String
  }

  type Mutation {
    registerUser(input: SignUpInput, file: Upload): User!
  }

  type Query {
    users: [User!]!
  }
`;

export { registerTypeDefs };
