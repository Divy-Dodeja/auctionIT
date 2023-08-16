const mongoose = require("mongoose");

const { Schema } = mongoose;

const verifyDomainSchema = new Schema(
  {
    domain: {
      type: mongoose.Types.ObjectId,
      ref: "Domain",
    },
    lastAttempt: {
      type: Date,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 10,
    },
    verifyString: {
      type: String,
    },
  },
  { timestamps: true }
);

const VerifyDomain = mongoose.model("VerifyDomain", verifyDomainSchema);

module.exports = VerifyDomain;
