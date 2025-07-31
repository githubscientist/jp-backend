const { validationResult } = require("express-validator");
const User = require('../models/User');

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

        // send a success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        })
    }
}

module.exports = {
    register,
}