const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID!): User
  }

  type Birthday {
    day: Int
    month: String
    year: Int
  }

  input birthdayInput {
    day: Int
    month: String
    year: Int
  }

  type User {
    _id: ID
    email: String
    phoneNumber: String
    apple: String
    firstName: String
    dateOfBirth: Birthday
    gender: String
    additionalGenderInfo: String
    sexuality: String
    interest: String
    age: String
    height: String
    ethnicity: String
    children: String
    home: String
    jobTitle: String
    jobLocation: String
    educationAttained: String
    school: String
    religiousBelief: String
    politicalBelief: String
    drinker: String
    smoker: String
    drugUse: String
  }

  input addUserInput {
    _id: ID
    email: String
    password: String
    phoneNumber: String
    apple: String
    firstName: String
    dateOfBirth: birthdayInput
    gender: String
    additionalGenderInfo: String
    sexuality: String
    interest: String
    age: String
    height: String
    ethnicity: String
    children: String
    home: String
    jobTitle: String
    jobLocation: String
    educationAttained: String
    school: String
    religiousBelief: String
    politicalBelief: String
    drinker: String
    smoker: String
    drugUse: String
  }

  type Mutation {
    loginPhone(phoneNumber: String!): Auth
    loginEmail(email: String!, password: String!): Auth
    addUser(userToSave: addUserInput): Auth
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
