const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    domain: {
      type: mongoose.Types.ObjectId,
      ref: "Domain",
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["placed", "suspended"],
      default: "placed",
    },
    suspendedReason: {
      type: String,
    },
  },
  { timestamps: true }
);

bidSchema.plugin(mongoosePaginate);

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
