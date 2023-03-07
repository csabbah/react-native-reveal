const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      phoneNumber: {
        type: String,
        unique: true,
      },
      apple: {
        type: String,
        unique: true,
      },
    },
    firstName: {
      type: String,
    },
    dateOfBirth: {
      day: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
    },
    gender: {
      sex: {
        type: String,
      },
      additionalInfo: {
        type: String,
      },
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
    job: {
      location: {
        type: String,
      },
      title: {
        type: String,
      },
    },
    education: {
      school: {
        type: String,
      },
      levelAttained: {
        type: String,
      },
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
