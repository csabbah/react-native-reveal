const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID!): User
    isExistingUser(
      email: String
      phoneNumber: String
      apple: String
    ): accountExists
  }

  type accountExists {
    appleExists: Boolean
    emailExists: Boolean
    phoneExists: Boolean
  }

  type Birthday {
    day: Int
    month: String
    year: Int
  }

  type Prompts {
    question: String
    answer: String
  }

  input birthdayInput {
    day: Int
    month: String
    year: Int
  }

  input promptInput {
    question: String
    answer: String
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
    prompts: [Prompts]
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
    prompts: [promptInput]
  }

  type Mutation {
    loginApple(sub: String!): Auth
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
