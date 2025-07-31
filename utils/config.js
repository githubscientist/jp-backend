// import dotenv and configure it, so that the env variables are available
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3002;

module.exports = {
    MONGODB_URI,
    PORT
}