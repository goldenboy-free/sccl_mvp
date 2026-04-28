import express from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {User} from '../models/index.js'

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) return res.status(400).json({ error: 'Username, password, and role are required' });
        if (username.length > 50) return res.status(400).json({ error: 'Username too long' });
        if (password.length < 6 || password.length > 128) return res.status(400).json({ error: 'Password must be 6-128 characters' });
        if (!['admin', 'bidder'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

        const user = await User.findUserByUsername(username);
        if (user) return res.status(409).json({ error: 'User already exists' });
        const new_user = await User.createUser({ username, password, role });
        const token = jwt.sign({id: new_user.id, role: new_user.role}, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ user: { id: new_user.id, username: new_user.username, role: new_user.role, created_at: new_user.created_at }, token });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({error: 'Registration failed'});
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

        const user = await User.findUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ user: { id: user.id, username: user.username, role: user.role, created_at: user.created_at }, token });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({error: 'Login failed'});
    }
});

export default router;
