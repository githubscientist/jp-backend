// import express
const express = require('express');

const cookieParser = require('cookie-parser');

// import router
const authRoutes = require('./routes/auth');

// create an Express application
const app = express();

// middlware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// middleware to handle url encoded bodies
app.use(express.urlencoded({ extended: true }));

// middleware to parse cookies
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// error handling middleware
// to be implemented later

// handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// export the app
module.exports = app;