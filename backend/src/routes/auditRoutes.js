import express from 'express';
import { Audit } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const audit = await Audit.log(req.body);
        res.status(201).json(audit);
    } catch (err) {
        console.error('Audit log error:', err.message);
        res.status(500).json({error: 'Failed to log audit'});
    }
});

export default router;
