const { validationResult } = require("express-validator");
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/auth');

const register = async (req, res) => {
    try {
        // check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // get the details from the request body
        const { name, email, password } = req.body;

        // check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // create a new user
        const user = await User.create({
            name,
            email,
            password
        });

        // send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        })
    }
}

const login = async (req, res) => {
    try {
        // check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        // get the email and password from the request body
        const { email, password } = req.body;

        // check if the user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // check if the user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'User account is not active. Please contact support.'
            });
        }

        // check if the password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // update the last login
        user.lastLogin = new Date();
        await user.save();

        // send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Login error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -__v');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get Me error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user details'
        });
    }
}

module.exports = {
    register,
    login,
    getMe
}