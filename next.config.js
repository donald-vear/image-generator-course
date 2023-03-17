const dotenv = require('dotenv');
dotenv.config()

module.exports = {
  publicRuntimeConfig: {
    dalleApiKey: process.env.DALL_E_API_KEY
  }
}