module.exports = {
  mongodb: {
    url: process.env.MONGODB_URL,
    port: process.env.MONGODB_PORT,
    database: process.env.MONGODB_DATABASE,
  },
  system: {
    port: process.env.PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expires: process.env.JWT_EXPIRES,
  },
  domain: {
    auctionLimitDays: 3,
  },
};
