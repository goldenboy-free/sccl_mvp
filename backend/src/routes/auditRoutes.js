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

router.get('/', async (req, res) => {
    try {
        const logs = await Audit.findAll();
        res.json(logs);
    } catch (err) {
        console.error('Fetch audit logs error:', err.message);
        res.status(500).json({error: 'Failed to fetch audit logs'});
    }
});

export default router;
