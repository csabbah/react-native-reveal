import { gql } from "@apollo/client";

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
