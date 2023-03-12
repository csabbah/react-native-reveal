const { User } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const crypto = require("crypto");

const PHONE_NUMBER_SALT = "my-secret-salt";

const resolvers = {
  Query: {
    user: async (parent, { _id }) => {
      if (_id) {
        const userData = await User.findOne({ _id: _id });
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async (parent, args) => {
      // Example of setting up an auth for viewing data
      // let auth = "test";
      // if (auth == process.env.auth) {
      //   return User.find();
      // }
      // throw new AuthenticationError("Not authorized to view");

      return User.find();
    },
    isExistingUser: async (parent, { email, phoneNumber, apple }) => {
      // If apple and or email inputs are empty, return false
      const checkApple = !apple ? false : await User.findOne({ apple: apple });
      const checkEmail = !email ? false : await User.findOne({ email: email });

      const hashedPhoneNumber = crypto
        .createHash("sha256")
        .update(`${PHONE_NUMBER_SALT}-${phoneNumber}`)
        .digest("hex");
      const checkPhone = await User.findOne({ phoneNumber: hashedPhoneNumber });

      let accountExists = {
        appleExists: checkApple ? true : false,
        emailExists: checkEmail ? true : false,
        phoneExists: checkPhone ? true : false,
      };

      return accountExists;
    },
  },
  Mutation: {
    loginApple: async (parent, { sub }) => {
      const user = await User.findOne({ apple: sub });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);
      return { token, user };
    },

    loginEmail: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect Password");
      }

      const token = signToken(user);
      return { token, user };
    },

    loginPhone: async (parent, { phoneNumber }) => {
      // ! IMPORTANT NOTE WHEN DEBUGGING (IN GRAPHQL VS. ON A PHYSICAL DEVICE)
      // ! MAKE SURE TO ADD THE CORRESPONDING AREA CODE (I.E. '+1') TO THE PHONE NUMBER

      // Hash the phone number input
      const hashedPhoneNumber = crypto
        .createHash("sha256")
        .update(`${PHONE_NUMBER_SALT}-${phoneNumber}`)
        .digest("hex");

      // Find the user with the hashed phone number
      const user = await User.findOne({ phoneNumber: hashedPhoneNumber });

      if (!user) {
        throw new AuthenticationError("Account doesn't exist");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, { userToSave }) => {
      // Hash the phone number
      const hashedPhoneNumber = crypto
        .createHash("sha256")
        .update(`${PHONE_NUMBER_SALT}-${userToSave.phoneNumber}`)
        .digest("hex");

      // Save the user with the hashed phone number
      const user = await User.create({
        ...userToSave,
        phoneNumber: hashedPhoneNumber,
      });

      // Generate token and return user and token
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
