import { gql } from "@apollo/client";

export const LOGIN_USER_PHONE = gql`
  mutation loginPhone($phoneNumber: String!) {
    loginPhone(phoneNumber: $phoneNumber) {
      token
      user {
        _id
        firstName
      }
    }
  }
`;
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        firstName
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($userToSave: addUserInput) {
    addUser(userToSave: $userToSave) {
      token
      user {
        _id
        firstName
        dateOfBirth {
          day
        }
      }
    }
  }
`;
