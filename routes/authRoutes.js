const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET_KEY = process.env.JWT

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        const existingUser = await User.query().findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.query().insert({
            email,
            name,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = await User.query().findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ token, user_id: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
