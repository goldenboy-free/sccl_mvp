import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';
import { Tender } from '../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tenders = await Tender.findAllTenders();
        res.json(tenders);
    } catch (err) {
        console.error('Get tenders error:', err.message);
        res.status(500).json({error: 'Failed to fetch tenders'});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tender = await Tender.findTenderById(req.params.id);
        if (!tender) return res.status(404).send('Tender not found');
        res.json(tender);
    } catch (err) {
        console.error('Get tender error:', err.message);
        res.status(500).json({error: 'Failed to fetch tender'});
    }
});

router.put('/:id', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const updated = await Tender.updateTender(req.params.id, req.body);
        if (!updated) return res.status(404).send('Tender not found');
        res.json({message: 'Updated'});
    } catch (err) {
        console.error('Update tender error:', err.message);
        res.status(500).json({error: 'Failed to update tender'});
    }
});

router.post('/', authenticateToken, authorizeRole(['admin']), async (req, res) => {
    try {
        const tender = await Tender.createTender(req.body);
        res.status(201).json(tender);
    } catch (err) {
        console.error('Create tender error:', err.message);
        res.status(500).json({error: 'Failed to create tender'});
    }
});

export default router;