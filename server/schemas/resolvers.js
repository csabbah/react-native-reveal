const { User } = require("../models");

const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const crypto = require("crypto");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id });
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
  },
  Mutation: {
    // login: async (parent, { email, password }) => {
    //   const user = await User.findOne({ email });

    //   if (!user) {
    //     throw new AuthenticationError("Incorrect credentials");
    //   }

    //   const correctPw = await user.isCorrectPassword(password);

    //   if (!correctPw) {
    //     throw new AuthenticationError("Incorrect credentials");
    //   }

    //   const token = signToken(user);
    //   return { token, user };
    // },

    loginPhone: async (parent, { phoneNumber }) => {
      // Hash the phone number input
      const hashedPhoneNumber = crypto
        .createHash("sha256")
        .update(phoneNumber)
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
        .update(userToSave.phoneNumber)
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
