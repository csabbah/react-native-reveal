import { gql } from "@apollo/client";

export const ACCOUNT_EXISTS = gql`
  query isExistingUser($email: String, $phoneNumber: String, $apple: String) {
    isExistingUser(email: $email, phoneNumber: $phoneNumber, apple: $apple) {
      appleExists
      phoneExists
      emailExists
    }
  }
`;

export const GET_USER = gql`
  query user($id: ID!) {
    user(_id: $id) {
      _id
      firstName
      phoneNumber
      dateOfBirth {
        year
        month
        day
      }
      gender
      additionalGenderInfo
      sexuality
      interest
      age
      height
      ethnicity
      children
      home
      jobLocation
      jobTitle
      school
      educationAttained
      religiousBelief
      politicalBelief
      drinker
      smoker
      drugUse
    }
  }
`;
