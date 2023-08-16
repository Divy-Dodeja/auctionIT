const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const domainSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    valid: {
      type: Boolean,
      default: false,
    },
    txtRecord: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    askAmount: {
      type: Number,
    },
    currentBid: {
      type: Number,
    },
    lastBidUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["created", "verify", "verified", "listed", "removed", "finished"],
      default: "created",
    },
    finishedAt: {
      type: Date,
    },
    winnerUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    lastDateOfAuction: {
      type: Date,
    },
    lastDateToPayAmount: {
      type: Date,
    },
    removeReason: {
      type: String,
    },
    isAutoList: {
      type: Boolean,
      default: false,
    },
    tld: {
      type: String,
    },
    verifyString: {
      type: String,
    },
    transactions: {
      created: {
        type: Date,
        default: new Date(),
      },
      verify: {
        type: Date,
      },
      verified: {
        type: Date,
      },
      listed: {
        type: Date,
      },
      removed: {
        type: Date,
      },
    },
    whois: {
      registrationDate: {
        type: Date,
      },
      expirationDate: {
        type: Date,
      },
      lastUpdated: {
        type: Date,
      },
      status: {
        type: [String],
      },
      registrar: {
        type: String,
      },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

domainSchema.plugin(mongoosePaginate);

domainSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "domain",
});

domainSchema.index({ url: "text" });

const Domain = mongoose.model("Domain", domainSchema);

module.exports = Domain;
