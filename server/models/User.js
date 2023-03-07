const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      unique: true,
    },
    apple: {
      type: String,
    },
    firstName: {
      type: String,
    },
    dateOfBirth: {
      day: {
        type: Number,
      },
      month: {
        type: String,
      },
      year: {
        type: Number,
      },
    },
    gender: {
      type: String,
    },
    additionalGenderInfo: {
      type: String,
    },
    sexuality: {
      type: String,
    },
    interest: {
      type: String,
    },
    age: {
      type: String,
    },
    height: {
      type: String,
    },
    ethnicity: {
      type: String,
    },
    children: {
      type: String,
    },
    home: {
      type: String,
    },
    jobLocation: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    school: {
      type: String,
    },
    educationAttained: {
      type: String,
    },
    religiousBelief: {
      type: String,
    },
    politicalBelief: {
      type: String,
    },
    drinker: {
      type: String,
    },
    smoker: {
      type: String,
    },
    drugUse: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    prompts: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// // hash user phoneNumber
// userSchema.pre("save", async function (next) {
//   if (this.isNew || this.isModified("phoneNumber")) {
//     const saltRounds = 10;
//     this.phoneNumber = await bcrypt.hash(this.phoneNumber, saltRounds);
//   }

//   next();
// });
// // custom method to compare and validate phoneNumber for logging in
// userSchema.methods.isCorrectNumber = async function (phoneNumber) {
//   return bcrypt.compare(phoneNumber, this.phoneNumber);
// };

const User = model("User", userSchema);

module.exports = User;
