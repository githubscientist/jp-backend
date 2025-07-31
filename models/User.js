const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// create a schema for User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Do not return password in queries
    },
    role: {
        type: String,
        enum: ['jobseeker', 'employer', 'admin'],
        default: 'jobseeker'
    },
    profile: {
        bio: String,
        skills: [String],
        experience: String,
        education: String,
        resume: String, // URL or path to the resume file
        profilePicture: String, // URL or path to the profile picture
        location: String,
        website: String,
        linkedin: String,
        github: String,
    },
    company: {
        name: String,
        description: String,
        website: String,
        location: String,
        logo: String, // URL or path to the company logo
        industry: String,
        size: String,
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true });

// Encrypt the password before saving
userSchema.pre('save', async function (next) {
    // check if the password is modified
    if (!this.isModified('password')) {
        next();
    }

    // hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt

    // call next to continue
    next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// create a model and export it
module.exports = mongoose.model('User', userSchema, 'users');