// import dotenv and configure it, so that the env variables are available
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    JWT_EXPIRE,
    NODE_ENV
}