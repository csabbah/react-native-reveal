import { gql } from "@apollo/client";

export const LOGIN_USER_PHONE = gql`
  mutation loginPhone($phoneNumber: String!) {
    loginPhone(phoneNumber: $phoneNumber) {
      token
      user {
        _id
      }
    }
  }
`;

export const LOGIN_USER_EMAIL = gql`
  mutation loginEmail($email: String!, $password: String!) {
    loginEmail(email: $email, password: $password) {
      token
      user {
        _id
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
