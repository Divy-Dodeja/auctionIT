const httpStatus = require("http-status");
const mongoose = require("mongoose");
const mongooseHistory = require("mongoose-history");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const { tokenMessages } = require("../messages");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },
    tokens: {
      type: [{ token: String }],
    },
  },
  { timestamps: true }
);

// static login method
userSchema.statics.login = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(
      tokenMessages.error.INVALID_CREDS,
      httpStatus.BAD_REQUEST
    );
  }
  if (user && !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      tokenMessages.error.INVALID_CREDS,
      httpStatus.BAD_REQUEST
    );
  }
  return user;
};

/**
 * deleting few fields before sending it to user!
 * @returns {Object<User>}
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  return user;
};

/**
 * Hashing the password before storing the actual user into the database!
 */
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
