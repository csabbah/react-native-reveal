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
    email: {
      type: String,
    },
    password: {
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

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
