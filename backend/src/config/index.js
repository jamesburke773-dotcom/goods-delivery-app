require('dotenv').config();
module.exports = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  stripeKey: process.env.STRIPE_SECRET_KEY,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379'
};
